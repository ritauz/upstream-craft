import { Deliverable, DeliverableType } from '@/domain/entities/deliverable';

type Phase = '要件定義' | '基本設計';
type KindFilter = DeliverableType | 'all';

type AssessmentResult = {
  risks: string[];                               // 箇条書き表示用（各要素は「【タイトル】+ 一文」）
  recommendations: string[];                     // 「◯◯を選択してください」
  missingByTitle: Record<string, string>;        // タイトル -> 一文のリスク
};

// データに合わせて：risks は string（後方互換で string[] も許容し、結合して一文化）
const normalizeRisk = (d: Deliverable): string => {
  const anyD: any = d as any;
  const r = anyD.risks;

  if (Array.isArray(r) && r.length > 0) {
    return r.join(' ').trim();
  }
  if (typeof r === 'string' && r.trim().length > 0) {
    return r.trim();
  }
};

// 返り値はシンプルな一文ずつ
export const assessDeliverableSelectionRisk = (
  allDeliverables: Deliverable[],
  selectedDeliverables: Deliverable[],
  category: Phase,
  kind: KindFilter = 'all'
): AssessmentResult => {
  const trim = (s: string) => (s ?? '').trim();

  const selectedIds = new Set(selectedDeliverables.map(d => d.id));

  const typeMatches = (d: Deliverable) =>
    kind === 'all' ? true : Array.isArray(d.type) ? d.type.includes(kind) : false;

  const missing = allDeliverables.filter(d =>
    trim(d.category) === trim(category) &&
    typeMatches(d) &&
    !selectedIds.has(d.id) && d.risks
  );

  const risks: string[] = [];
  const recommendations: string[] = [];
  const missingByTitle: Record<string, string> = {};

  for (const d of missing) {
    const summary = normalizeRisk(d);
    risks.push(`【${d.title}】${summary}`);
    recommendations.push(`${d.title} を選択してください`);
    missingByTitle[d.title] = summary;
  }

  return { risks, recommendations, missingByTitle };
};
