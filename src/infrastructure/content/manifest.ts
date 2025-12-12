// 目的: manifest.json を取得し、テンプレIDから公開URLを解決する。

import {
  TemplateManifest,
  TemplateEntry,
  LegacyManifest,
  convertLegacyManifest,
  isLegacyManifest,
  parseStandardMajor,
  parseStandardVersion,
} from '@/domain/templates/manifest';

// 取得済みキャッシュ
let _cached: TemplateManifest | null = null;

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
    const envVal = import.meta.env.VITE_ENV || 'prod';
    return `/blob/${envVal}/${u.pathname.replace(/^\/+/, '')}`;
  } catch {
    // 既に相対パスなどはそのまま
    return absUrl;
  }
};

const parseManifest = (raw: unknown): TemplateManifest => {
  if (isLegacyManifest(raw)) {
    const major = parseStandardMajor(import.meta.env.VITE_TPL_STANDARD_MAJOR, 1);
    const version = parseStandardVersion(import.meta.env.VITE_TPL_STANDARD_VERSION, '1.0');
    return convertLegacyManifest(raw as LegacyManifest, major, version);
  }
  const parsed = raw as TemplateManifest;
  return {
    standardMajor: parsed.standardMajor ?? parseStandardMajor(import.meta.env.VITE_TPL_STANDARD_MAJOR, 1),
    standardVersion: parsed.standardVersion ?? parseStandardVersion(import.meta.env.VITE_TPL_STANDARD_VERSION, '1.0'),
    generatedAt: parsed.generatedAt,
    templates: parsed.templates,
  };
};

// manifest を取得（force=true で再取得）
export const loadManifest = async (force = false): Promise<TemplateManifest> => {
  if (_cached && !force) return _cached;
  const res = await fetch(manifestUrl(), { cache: 'no-cache' });
  if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
  const raw = await res.json();
  _cached = parseManifest(raw);
  return _cached!;
};

// 指定テンプレIDの一覧を返す
export const listTemplateIds = async (): Promise<string[]> => {
  const mf = await loadManifest();
  return mf.templates.map(t => t.id);
};

const findTemplate = async (id: string): Promise<TemplateEntry> => {
  const mf = await loadManifest();
  const entry = mf.templates.find(x => x.id === id);
  if (!entry) throw new Error(`template not found: ${id}`);
  return entry;
};

// 指定テンプレIDから「取得用URL」を返す
// 返すURLは /blob/... の同一オリジンに寄せてあるので CORS 不発。
export const resolveTemplateUrl = async (id: string): Promise<string> => {
  const entry = await findTemplate(id);
  if (!entry.url) throw new Error(`template url missing: ${id}`);
  return toProxyUrl(entry.url);
};

export type { TemplateManifest, TemplateEntry };
