import type { VercelRequest, VercelResponse } from '@vercel/node';

type Check = { name: string; ok: boolean; detail?: string };

const head = async (url: string, ms = 5000) => {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: c.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
};

export default async (_req: VercelRequest, res: VercelResponse) => {
  const checks: Check[] = [];

  // 1) アプリ自体
  checks.push({ name: 'app', ok: true });

  // 2) Vercel Blob 疎通（公開URLを環境変数で指定）
  const blobUrl = process.env.BLOB_HEALTH_URL;
  if (!blobUrl) {
    checks.push({ name: 'blob', ok: false, detail: 'BLOB_HEALTH_URL not set' });
  } else {
    try {
      const r = await head(blobUrl, 5000);
      checks.push({ name: 'blob', ok: r.ok && r.status === 200, detail: `status=${r.status}` });
    } catch (e) {
      checks.push({ name: 'blob', ok: false, detail: String(e) });
    }
  }

  const allOk = checks.every(c => c.ok);
  res.status(allOk ? 200 : 503).json({ ok: allOk, checks });
};
