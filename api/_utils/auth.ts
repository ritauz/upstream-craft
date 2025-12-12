import type { VercelRequest, VercelResponse } from '@vercel/node';

const parseAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

const extractUserEmail = (req: VercelRequest): string | null => {
  const headerCandidates = [
    'x-user-email',
    'x-ms-client-principal-name',
    'x-client-email',
  ];
  for (const key of headerCandidates) {
    const value = req.headers[key];
    if (typeof value === 'string' && value) return value.toLowerCase();
    if (Array.isArray(value) && value.length) return value[0].toLowerCase();
  }
  return null;
};

export const requireAdmin = (req: VercelRequest, res: VercelResponse): boolean => {
  const admins = parseAdminEmails();
  if (!admins.length) {
    // 開発環境用に制約なしで通す
    return true;
  }
  const email = extractUserEmail(req);
  if (!email || !admins.includes(email)) {
    res.status(403).json({ error: 'forbidden' });
    return false;
  }
  return true;
};
