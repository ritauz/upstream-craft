import matter from 'gray-matter';
import { put } from '@vercel/blob';
import { TemplateDoc, TemplateSetVersion } from '@/domain/templates/template-set';
import { TemplateManifest, TemplateEntry } from '@/domain/templates/manifest';
import { loadManifestServer, saveManifestServer } from './manifest';

const resolveTemplateKey = (targetMajor: number, templateId: string): string => {
  const base = process.env.TPL_TEMPLATE_BASE_KEY || `templates/v${targetMajor}`;
  return `${base}/${templateId}.md`;
};

const ensureBlobToken = (): string => {
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  return token;
};

const resolveTemplateUrl = (entry: TemplateEntry): string => {
  if (entry.url) return entry.url;
  if (/^https?:\/\//.test(entry.key)) return entry.key;
  const base = process.env.TPL_BLOB_BASE_URL;
  if (base) return `${base.replace(/\/$/, '')}/${entry.key}`;
  throw new Error(`template url missing: ${entry.id}`);
};

const fetchTemplateDoc = async (entry: TemplateEntry): Promise<TemplateDoc> => {
  const targetUrl = resolveTemplateUrl(entry);
  const res = await fetch(targetUrl, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`template fetch failed: ${entry.id}`);
  const raw = await res.text();
  const parsed = matter(raw);
  const fm = parsed.data ?? {};
  const body = parsed.content ?? '';
  return {
    id: entry.id,
    frontMatter: { id: entry.id, ...fm },
    body,
    updatedAt: entry.updatedAt,
  };
};

export const getTemplateSet = async (): Promise<TemplateSetVersion> => {
  const manifest = await loadManifestServer();
  const templates = await Promise.all(manifest.templates.map(fetchTemplateDoc));
  return {
    standardMajor: manifest.standardMajor,
    standardVersion: manifest.standardVersion,
    generatedAt: manifest.generatedAt,
    templates,
  };
};

const serializeTemplate = (doc: TemplateDoc): string => {
  const fm = { ...doc.frontMatter, id: doc.frontMatter.id || doc.id };
  return matter.stringify(doc.body, fm);
};

const buildManifest = (
  baseManifest: TemplateManifest,
  entries: TemplateEntry[],
  nextVersion: string,
): TemplateManifest => ({
  standardMajor: baseManifest.standardMajor,
  standardVersion: nextVersion,
  generatedAt: new Date().toISOString(),
  templates: entries,
});

export const saveTemplateSetAsNewVersion = async (
  targetMajor: number,
  nextVersion: string,
  templates: TemplateDoc[],
): Promise<TemplateSetVersion> => {
  const token = ensureBlobToken();
  const manifest = await loadManifestServer();

  const entries: TemplateEntry[] = [];
  for (const doc of templates) {
    const key = resolveTemplateKey(targetMajor, doc.id);
    const content = serializeTemplate(doc);
    const uploaded = await put(key, Buffer.from(content, 'utf8'), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: 'text/markdown',
      token,
    });

    entries.push({
      id: doc.id,
      key,
      url: uploaded.url,
      updatedAt: new Date().toISOString(),
    });
  }

  const nextManifest = buildManifest(
    { ...manifest, standardMajor: targetMajor },
    entries,
    nextVersion,
  );
  await saveManifestServer(nextManifest);

  return {
    standardMajor: targetMajor,
    standardVersion: nextVersion,
    generatedAt: nextManifest.generatedAt,
    templates,
  };
};
