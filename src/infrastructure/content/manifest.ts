// 目的: manifest.json を取得し、テンプレIDとリビジョンから公開URLを解決する。

export type RevisionEntry = {
  revision: string; // 例: "Rev2025.10.16 14:32"
  key: string;      // 例: "templates/req-spec/Rev2025.10.16_14-32/req-spec.md"
  url?: string;     // Blob 公開URL（外部ドメイン）
  updatedAt: string;
};

export type ManifestEntry = {
  id: string;
  latestRevision: string;   // 直近リビジョン
  revisions: RevisionEntry[]; // 古い→新しい順
};

export type Manifest = {
  generatedAt: string;
  entries: ManifestEntry[];
};

// 取得済みキャッシュ
let _cached: Manifest | null = null;

// manifest の取得先 URL を決める
// - VITE_TPL_MANIFEST_URL があればそれを使う
// - なければ /blob/templates/manifest.json（vercel.json の rewrite 経由）
const manifestUrl = (): string => {
  const url = import.meta.env.VITE_TPL_MANIFEST_URL;
  return url || '/templates/manifest.json';
};

// 外部ドメインの Blob URL を /blob/... に変換（CORS回避のため同一オリジンへプロキシ）
const toProxyUrl = (absUrl: string): string => {
  try {
    const u = new URL(absUrl);
    const envVal = import.meta.env.VITE_ENV;
    // pathname だけを引き継いで /blob へ
    console.log(`/blob/${envVal}/${u.pathname.replace(/^\/+/, '')}`);
    return `/blob/${envVal}/${u.pathname.replace(/^\/+/, '')}`;
  } catch {
    // 既に相対パスなどはそのまま
    return absUrl;
  }
};

// manifest を取得（force=true で再取得）
export const loadManifest = async (force = false): Promise<Manifest> => {
  if (_cached && !force) return _cached;
  const res = await fetch(manifestUrl(), { cache: 'no-cache' });
  if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
  _cached = await res.json();
  return _cached!;
};

// 指定テンプレIDの「全リビジョン」（古い→新しい順）を返す
export const listRevisions = async (id: string): Promise<string[]> => {
  const mf = await loadManifest();
  const e = mf.entries.find(x => x.id === id);
  if (!e) throw new Error(`template not found: ${id}`);
  return e.revisions.map(r => r.revision);
};

// 指定テンプレIDの「最新リビジョン」を返す
export const getLatestRevision = async (id: string): Promise<string> => {
  const mf = await loadManifest();
  const e = mf.entries.find(x => x.id === id);
  if (!e) throw new Error(`template not found: ${id}`);
  return e.latestRevision;
};

// 指定テンプレID + リビジョン（未指定なら最新）から「取得用URL」を返す
// 返すURLは /blob/... の同一オリジンに寄せてあるので CORS 不発。
export const resolveTemplateUrl = async (id: string, revision?: string): Promise<string> => {
  const mf = await loadManifest();
  const e = mf.entries.find(x => x.id === id);
  if (!e) throw new Error(`template not found: ${id}`);

  const rev = revision || e.latestRevision;
  const r = e.revisions.find(x => x.revision === rev);
  if (!r?.url) throw new Error(`revision not found: ${id}@${rev}`);

  return toProxyUrl(r.url);
};
