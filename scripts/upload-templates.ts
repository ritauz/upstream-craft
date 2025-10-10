import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';
import { put } from '@vercel/blob';

type ManifestEntry = { id: string; key: string; url?: string; hash: string; updatedAt: string };
type Manifest = { generatedAt: string; entries: ManifestEntry[] };

const sha256 = (buf: Buffer): string =>
  createHash('sha256').update(buf).digest('hex');

const buildKey = (absPath: string, baseDir: string, id: string, hash: string, ext: string): string =>
  `templates/${path.dirname(path.relative(baseDir, absPath)).replace(/\\+/g, '/')}/${id}.${hash}.${ext}`.replace(/\/\.\//g, '/');

const uploadAll = async (): Promise<void> => {
  const PUBLIC_ACCESS = process.env.PUBLIC_ACCESS !== 'false'; // 既定: public
  const BASE = 'content/templates';
  const MANIFEST_KEY = 'templates/manifest.json';

  const files = await globby(`${BASE}/**/*.{md,mdx}`);
  const entries: ManifestEntry[] = [];

  for (const file of files) {
    const buf = await readFile(file);
    const hash = sha256(buf).slice(0, 12);
    const id = path.basename(file).replace(/\.(md|mdx)$/i, '');
    const ext = path.extname(file).slice(1).toLowerCase();
    const key = buildKey(file, BASE, id, hash, ext);

    const uploaded = await put(key, buf, {
      access: 'public',
      addRandomSuffix: true,
      contentType: ext === 'mdx' ? 'text/mdx' : 'text/markdown'
    });

    entries.push({
      id,
      key,
      url: PUBLIC_ACCESS ? uploaded.url : undefined,
      hash,
      updatedAt: new Date().toISOString()
    });

    console.log(`uploaded: ${id} -> ${key}`);
  }

  const manifest: Manifest = { generatedAt: new Date().toISOString(), entries };
  const manifestBuf = Buffer.from(JSON.stringify(manifest, null, 2));

  const m = await put(MANIFEST_KEY, manifestBuf, {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json'
  });

  console.log(`manifest: ${m.url}`);
  await writeFile('.tmp_manifest.json', JSON.stringify(manifest, null, 2));
};

uploadAll().catch(e => {
  console.error(e);
  process.exit(1);
});
