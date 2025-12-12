import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTemplateSet } from '@/server/content/template-set-service';
import { requireAdmin } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  if (!requireAdmin(req, res)) return;

  try {
    const data = await getTemplateSet();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
