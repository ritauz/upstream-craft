import { TemplateDoc, TemplateSetVersion } from '@/domain/templates/template-set';

export const fetchTemplateSet = async (): Promise<TemplateSetVersion> => {
  const res = await fetch('/api/admin/template-set', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`failed to load template set: ${res.status}`);
  return res.json();
};

export const saveTemplateSetVersion = async (
  payload: { targetMajor: number; nextVersion: string; templates: TemplateDoc[] }
): Promise<TemplateSetVersion> => {
  const res = await fetch('/api/admin/template-set/version', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`failed to save template set: ${res.status}`);
  return res.json();
};
