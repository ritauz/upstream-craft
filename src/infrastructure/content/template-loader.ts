// 目的: 開発ローカル/リモート問わずテンプレ本文（フロントマター抜き）を返す。
// 注意: フロントでは gray-matter を使わず、軽量な前処理で YAML フロントマターを除去する。

import { resolveTemplateUrl } from './manifest';

// ローカル開発用に .md/.mdx を raw で取り込む
const templates = import.meta.glob('../../../content/templates/**/*.{md,mdx}', { query: '?raw' });

/**
 * フロントマター（先頭 '---' ... '---'）を除去して本文を返す。
 * - 先頭に '---' が無い場合は raw をそのまま返す。
 * - 本文中の '---' は無視。閉じフェンスは最初に見つかったもののみ採用。
 */
const stripFrontMatter = (raw: string): string => {
  if (!raw) return raw;
  const text = raw.replace(/^\uFEFF/, ''); // BOM除去
  if (!/^\s*---\s*(\r?\n|$)/.test(text)) return text;
  const firstNL = text.indexOf('\n');
  if (firstNL < 0) return ''; // 1行のみの異常ケース
  const rest = text.slice(firstNL + 1);
  const m = /^(?:-{3})\s*(?:\r?\n|$)/m.exec(rest);
  if (!m) return text; // 閉じフェンスが無い場合は安全のため raw を返す
  return rest.slice(m.index + m[0].length);
};

// ローカル読み込み（id → .md/.mdx）
const loadLocal = async (templateId: string): Promise<string> => {
  const base = '../../../content/templates/';
  const tryKeys = [
    `${base}${templateId}`,
    `${base}${templateId}.md`,
    `${base}${templateId}.mdx`,
  ];
  const loader = tryKeys.map(k => templates[k]).find(Boolean);
  if (!loader) throw new Error(`local template not found: ${templateId}`);
  const mod = await (loader as () => Promise<{ default: string }>)();
  return stripFrontMatter(mod.default);
};

type LoadOptions = { revision?: string };

// 公開API: テンプレ本文を取得（revision 未指定なら最新）
export const loadTemplateBody = async (templateId: string, opts: LoadOptions = {}): Promise<string> => {
  const source = import.meta.env.VITE_TPL_SOURCE;
  if (source === 'local') {
    return await loadLocal(templateId);
  }
  const url = await resolveTemplateUrl(templateId, opts.revision);
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`template fetch failed: ${res.status}`);
  const text = await res.text();
  return stripFrontMatter(text); // 念のため二重ガード
};
