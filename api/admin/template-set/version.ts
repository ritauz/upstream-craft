import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveTemplateSetAsNewVersion } from '@/server/content/template-set-service';
import { requireAdmin } from '../../_utils/auth';
import { TemplateDoc } from '@/domain/templates/template-set';

const parseBody = (req: VercelRequest): { targetMajor: number; nextVersion: string; templates: TemplateDoc[] } => {
  const raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { targetMajor, nextVersion, templates } = raw as { targetMajor?: number; nextVersion?: string; templates?: TemplateDoc[] };
  if (!targetMajor || !nextVersion || !Array.isArray(templates)) {
    throw new Error('invalid payload');
  }
  return { targetMajor: Number(targetMajor), nextVersion: String(nextVersion), templates };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!requireAdmin(req, res)) return;

  try {
    const payload = parseBody(req);
    const result = await saveTemplateSetAsNewVersion(payload.targetMajor, payload.nextVersion, payload.templates);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
}
