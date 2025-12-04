// 目的: Markdown/MDX テンプレートを「リビジョン単位」で Vercel Blob に配置し、manifest.json を更新する。
// 仕様:
// - Front Matter: id(必須/ファイル名で補完可), newRevision(boolean, 省略時は false)
// - newRevision: true  → 新しいリビジョン(RevYYYY.MM.DD HH:mm)を作成
// - newRevision: false → 直近リビジョンを「同じキーで」上書き（履歴を増やさない）
// - アップロード時は本文のみを保存（フロントマターは保存しない）

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';
import matter from 'gray-matter';
import { put } from '@vercel/blob';

type RevisionEntry = {
  revision: string;   // 例: "Rev2025.10.16 14:32"
  key: string;        // 例: "templates/req-spec/Rev2025.10.16_14-32/req-spec.md"
  url?: string;       // 公開URL (PUBLIC_ACCESS が true のとき)
  updatedAt: string;  // ISO時刻
};

type ManifestEntry = {
  id: string;                 // テンプレID
  latestRevision: string;     // 直近のリビジョン名
  revisions: RevisionEntry[]; // リビジョン一覧（古い→新しい順）
};

type Manifest = {
  generatedAt: string;        // マニフェスト生成時刻
  entries: ManifestEntry[];
};

// ====== 環境変数 ======
const TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN || '';

const PUBLIC_ACCESS = process.env.PUBLIC_ACCESS !== 'false';

// Blob の manifest.json の保存先キー（固定）
const MANIFEST_KEY = 'templates/manifest.json';

// 既存 manifest の公開URL（アプリから参照しているURL）。マージのために GET。
const MANIFEST_URL = process.env.TPL_MANIFEST_URL || ''; // 例: "/blob/templates/manifest.json" ではなく「公開URL」を推奨

// ====== ユーティリティ ======

// 先頭/末尾の空白などを避け、ファイル名として安全にする
const safeIdFromFile = (file: string): string =>
  path.basename(file).replace(/\.(md|mdx)$/i, '');

// "RevYYYY.MM.DD HH:mm" を生成（表示用ラベル）
const formatRevisionLabel = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `Rev${yyyy}.${MM}.${DD} ${hh}:${mm}`;
};

// リビジョン名をパスセグメントに安全変換（スペース→"_", ":"→"-" など）
// 例: "Rev2025.10.16 14:32" → "Rev2025.10.16_14-32"
const revisionToKeySegment = (revision: string): string =>
  revision.replace(/\s+/g, '_').replace(/:/g, '-');

// Blob 保存キーを構築（id/revision/key の三段構成。拡張子は md or mdx）
const buildKey = (id: string, revision: string, ext: 'md' | 'mdx'): string => {
  const revSeg = revisionToKeySegment(revision);
  return `templates/${id}/${revSeg}/${id}.${ext}`;
};

// 既存 manifest を取得（なければ null）
const fetchExistingManifest = async (): Promise<Manifest | null> => {
  if (!MANIFEST_URL) return null;
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
    if (!res.ok) return null;
    return (await res.json()) as Manifest;
  } catch {
    return null;
  }
};

// 既存 manifest から id に対応するエントリを探す
const getEntry = (m: Manifest | null, id: string): ManifestEntry | null => {
  if (!m) return null;
  return m.entries.find(e => e.id === id) ?? null;
};

// エントリ配列を id アルファベット順に整列
const sortEntries = (entries: ManifestEntry[]): ManifestEntry[] =>
  entries.sort((a, b) => a.id.localeCompare(b.id));

// ====== メイン処理 ======
const main = async (): Promise<void> => {
  if (!TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN / VERCEL_BLOB_READ_WRITE_TOKEN が未設定です。');
    process.exit(1);
  }

  // 対象テンプレを列挙
  const files = await globby('content/templates/**/*.{md,mdx}');

  // 既存 manifest を取得し、マージ更新していく
  const existing = await fetchExistingManifest();
  const byId = new Map<string, ManifestEntry>();
  (existing?.entries ?? []).forEach(e => byId.set(e.id, structuredClone(e)));

  for (const file of files) {
    // ファイル読み込みと front matter 解析
    const raw = await readFile(file, 'utf8');
    const fm = matter(raw); // fm.data にメタ、fm.content に本文
    const ext: 'md' | 'mdx' = file.toLowerCase().endsWith('.mdx') ? 'mdx' : 'md';

    // id は front matter 優先。無ければファイル名基準。
    const id = (fm.data?.id as string | undefined)?.trim() || safeIdFromFile(file);

    // newRevision: boolean。省略時は false 
    const newRevision = typeof fm.data?.newRevision === 'boolean'
      ? (fm.data.newRevision as boolean)
      : false;

    // 本文のみアップロード（front matter は保存しない）
    const body = fm.content ?? '';

    // 既存エントリを取得 or 新規
    const current = byId.get(id) || { id, latestRevision: '', revisions: [] as RevisionEntry[] };

    // 直近のリビジョン（存在すれば）
    const prevRevLabel = current.latestRevision || null;
    const now = new Date();
    const nextRevLabel = newRevision
      ? formatRevisionLabel(now)   // 新しい履歴を切る
      : (prevRevLabel || formatRevisionLabel(now)); // 直近が無ければ初版として作る

    // アップロード先キー（リビジョンに紐づく固定パス）
    const key = buildKey(id, nextRevLabel, ext);

    // put: リビジョンのファイル本体を保存
    // - newRevision=true なら「新しいキー」に保存（通常 allowOverwrite: true でも false でもOK）
    // - newRevision=false なら「直近のキーに」上書きしたいが、URLを保つため nextRevLabel を直近ラベルに合わせる
    //   → 上記で prevRevLabel がある場合はそれを nextRevLabel に採用済み
    const uploaded = await put(key, Buffer.from(body, 'utf8'), {
      token: TOKEN,
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,         // 同じキーに再アップロードする可能性があるため
      contentType: ext === 'mdx' ? 'text/mdx' : 'text/markdown',
      cacheControlMaxAge: 0         // 上書き運用のため強キャッシュ禁止
    });

    // manifest の更新
    const rec: RevisionEntry = {
      revision: nextRevLabel,
      key,
      url: PUBLIC_ACCESS ? uploaded.url : undefined,
      updatedAt: new Date().toISOString()
    };

    // 既存の同リビジョンがあれば差し替え、無ければ追加
    const existedIdx = current.revisions.findIndex(r => r.revision === nextRevLabel);
    if (existedIdx >= 0) {
      current.revisions[existedIdx] = rec;
    } else {
      current.revisions.push(rec);
      // 古い→新しい順で並べたいので、時系列でソート（revision文字列は辞書順でもだいたい時系列になる）
      current.revisions.sort((a, b) => a.revision.localeCompare(b.revision));
    }

    // 最新リビジョンは newRevision=true の時だけ前進
    // false ならラベルは変えず中身だけ差し替え（＝履歴を増やさない）
    if (newRevision || !prevRevLabel) {
      current.latestRevision = nextRevLabel;
    }

    byId.set(id, current);

    console.log(
      newRevision
        ? `created revision: ${id}@${nextRevLabel} -> ${key}`
        : `updated latest:   ${id}@${nextRevLabel} -> ${key}`
    );
  }

  // 出力 manifest を作成
  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    entries: sortEntries(Array.from(byId.values()))
  };

  // Blob へ保存（manifest は毎回上書き）
  const out = Buffer.from(JSON.stringify(manifest, null, 2));
  const m = await put(MANIFEST_KEY, out, {
    token: TOKEN,
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 0
  });

  console.log(`manifest: ${m.url}`);

  // デバッグ用にローカル出力
  await writeFile('.tmp_manifest.json', out);
};

// 実行
(main)().catch(err => {
  console.error(err);
  process.exit(1);
});
