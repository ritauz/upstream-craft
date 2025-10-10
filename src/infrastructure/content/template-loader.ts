// src/infrastructure/content/template-loader.ts
import { resolveTemplateUrl } from './manifest';

// すべての *.md を事前に「カタログ化」しておく
// Vite v5 なら { as: 'raw' } が使える。v4系なら { query: '?raw' } に変えて。
const templates = import.meta.glob(
  '../../../content/templates/**/*.md',
  { query: '?raw' }
);

async function loadLocal(templateId: string): Promise<string> {
  // templateId は "req/tpl-req-01.md" でも "req/tpl-req-01" でもOKにしておく
  const base = '../../../content/templates/';
  const keyWithExt = `${base}${templateId}`;
  const keyNoExt = `${base}${templateId}.md`;

  const loader = templates[keyWithExt] || templates[keyNoExt];
  if (!loader) {
    // どのキーにも該当しない=存在しない
    throw new Error(`local template not found: ${templateId}`);
  }
  const mod = await loader();
  return (mod as { default: string }).default;
}

export const loadTemplateBody = async (templateId: string): Promise<string> => {
  const source = import.meta.env.VITE_TPL_SOURCE;
  if (source === 'local') return await loadLocal(templateId);

  const url = await resolveTemplateUrl(templateId);
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`template fetch failed: ${res.status}`);
  return await res.text();
};
