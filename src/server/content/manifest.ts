import { put } from '@vercel/blob';
import {
  TemplateManifest,
  convertLegacyManifest,
  isLegacyManifest,
  parseStandardMajor,
  parseStandardVersion,
} from '@/domain/templates/manifest';

let cached: TemplateManifest | null = null;

const resolveManifestUrl = (): string => {
  return process.env.TPL_MANIFEST_URL || '/templates/manifest.json';
};

const resolveManifestKey = (targetMajor: number): string => {
  if (process.env.TPL_MANIFEST_BLOB_KEY) return process.env.TPL_MANIFEST_BLOB_KEY;
  return `templates/v${targetMajor}/manifest.json`;
};

const parseManifest = (raw: unknown): TemplateManifest => {
  if (isLegacyManifest(raw)) {
    const major = parseStandardMajor(process.env.TPL_STANDARD_MAJOR, 1);
    const version = parseStandardVersion(process.env.TPL_STANDARD_VERSION, '1.0');
    return convertLegacyManifest(raw, major, version);
  }
  const parsed = raw as TemplateManifest;
  return {
    standardMajor: parsed.standardMajor ?? parseStandardMajor(process.env.TPL_STANDARD_MAJOR, 1),
    standardVersion: parsed.standardVersion ?? parseStandardVersion(process.env.TPL_STANDARD_VERSION, '1.0'),
    generatedAt: parsed.generatedAt,
    templates: parsed.templates,
  };
};

export const loadManifestServer = async (force = false): Promise<TemplateManifest> => {
  if (cached && !force) return cached;
  const url = resolveManifestUrl();
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
  const raw = await res.json();
  cached = parseManifest(raw);
  return cached;
};

export const saveManifestServer = async (manifest: TemplateManifest): Promise<void> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set');

  const key = resolveManifestKey(manifest.standardMajor);
  const body = JSON.stringify(manifest, null, 2);
  await put(key, Buffer.from(body, 'utf8'), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: 'application/json',
    token,
  });

  cached = manifest;
};
