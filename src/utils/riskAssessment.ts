import { Deliverable, RiskAssessment, DeliverableRisk } from '@/types/deliverable';

type Phase = '要件定義' | '基本設計';

/**
 * 選択された成果物に基づいてリスク評価を行う（phase を考慮）
 * - 判定の中心は priority と dependencies
 * - category には '要件定義' | '基本設計' が入る前提
 */
export const assessDeliverableSelectionRisk = (
  allDeliverables: Deliverable[],
  selectedDeliverables: Deliverable[],
  category: Phase
): RiskAssessment => {
  const risks: DeliverableRisk[] = [];
  const recommendations: string[] = [];

  const allById = new Map(allDeliverables.map(d => [d.id, d]));
  const selectedIds = new Set(selectedDeliverables.map(d => d.id));
  const inPhase = (d: Deliverable) => d.category === category;

  // 1) フェーズ内の Must の充足チェック
  const mustInPhase = allDeliverables.filter(d => inPhase(d) && d.priority === 'Must');
  const missingMust = mustInPhase.filter(d => !selectedIds.has(d.id));

  if (missingMust.length > 0) {
    risks.push({
      id: 'missing-must-in-phase',
      level: 'high',
      description: `このフェーズ（${category}）の必須成果物が不足しています`,
      impact: `${missingMust.map(d => d.title).join('、')} が未選択のため、後続の整合性・判断材料が欠落します。`,
      mitigation: `このフェーズ（${category}）の Must をすべて選択してください。`
    });
    recommendations.push(`このフェーズの Must（${missingMust.map(d => d.title).join('、')}）を選択してください`);
  }

  // 2) 選択セット内の依存関係充足チェック（未選択の依存）
  const dependencyGaps: string[] = [];
  selectedDeliverables.forEach(d => {
    (d.dependencies ?? []).forEach(depId => {
      if (!selectedIds.has(depId)) {
        const dep = allById.get(depId);
        const depLabel = dep ? dep.title : depId;
        dependencyGaps.push(`${d.title} が依存する ${depLabel}`);
      }
    });
  });

  if (dependencyGaps.length > 0) {
    risks.push({
      id: 'dependency-missing',
      level: 'high',
      description: '依存関係の未充足があります',
      impact: `${dependencyGaps.join('、')} が未選択のため、成果物の整合性が崩れます。`,
      mitigation: '不足している依存成果物を選択するか、依存元の選択を見直してください。'
    });
    recommendations.push('依存関係を満たすよう不足成果物を選択してください');
  }

  // 3) フェーズ不整合の依存（下流フェーズへ依存していないか）
  //   例：要件定義フェーズの成果物が、基本設計フェーズの成果物に依存している → 順序の破綻
  const phaseOrder: Record<Phase, number> = { '要件定義': 1, '基本設計': 2 };
  const crossPhaseIssues: string[] = [];

  selectedDeliverables.forEach(d => {
    const deps = d.dependencies ?? [];
    deps.forEach(depId => {
      const dep = allById.get(depId);
      if (!dep) return;
      // 下流（番号が大きい）への依存はリスク
      if (dep.category && d.category && phaseOrder[d.category as Phase] < phaseOrder[dep.category as Phase]) {
        crossPhaseIssues.push(`${d.title}（${d.category}）→ ${dep.title}（${dep.category}）`);
      }
    });
  });

  if (crossPhaseIssues.length > 0) {
    risks.push({
      id: 'cross-phase-dependency',
      level: 'medium',
      description: 'フェーズ順序と矛盾する依存関係があります',
      impact: `${crossPhaseIssues.join('、')} への依存は工程順序の破綻を招き、手戻りリスクが増大します。`,
      mitigation: '依存先の定義／順序を見直すか、同フェーズ内で満たせる代替成果物を検討してください。'
    });
    recommendations.push('フェーズ順序と依存の整合性を確認してください');
  }

  // 4) Orphan 選択（Must なしで Should/Could を先行選択）
  //   ロジック：このフェーズで Must を一つも選ばず、Should/Could だけ選んでいる
  const hasMustSelectedInPhase = selectedDeliverables.some(d => inPhase(d) && d.priority === 'Must');
  const hasNonMustSelectedInPhase = selectedDeliverables.some(d => inPhase(d) && d.priority !== 'Must');

  if (!hasMustSelectedInPhase && hasNonMustSelectedInPhase) {
    risks.push({
      id: 'orphan-nonmust',
      level: 'medium',
      description: 'Must を満たさずに Should/Could を先行選択しています',
      impact: '根拠となる基礎情報が未整備のまま設計・検討が進み、後戻りや差戻しが発生しやすくなります。',
      mitigation: 'まず本フェーズの Must を優先選択し、次に Should/Could を追加してください。'
    });
    recommendations.push('本フェーズの Must を優先して選択してください');
  }

  // 5) 依存未充足の Non-Must を局所判定（説明の一貫性を強化）
  //   Non-Must（Should/Could）が未充足依存を持つ場合、個別の中リスクを付与
  const unmetNonMust: string[] = [];
  selectedDeliverables
    .filter(d => d.priority !== 'Must')
    .forEach(d => {
      const missing = (d.dependencies ?? []).filter(depId => !selectedIds.has(depId));
      if (missing.length > 0) {
        unmetNonMust.push(`${d.title}（${d.priority}）→ ${missing.map(id => allById.get(id)?.title ?? id).join('、')}`);
      }
    });

  if (unmetNonMust.length > 0) {
    risks.push({
      id: 'nonmust-with-unmet-deps',
      level: 'medium',
      description: 'Should/Could の依存未充足があります',
      impact: `${unmetNonMust.join('、')} の依存が満たされていないため、当該成果物は有効に機能しません。`,
      mitigation: '該当成果物の依存を満たすか、依存元が整うまで選択を保留してください。'
    });
    recommendations.push('Should/Could の依存充足を優先してください');
  }

  // 総合リスク（スコア方式：high=3, medium=2, low=1）
  const overallRisk = determineOverallRiskByScore(risks);

  return {
    overallRisk,
    risks,
    recommendations
  };
};

/**
 * 総合リスクレベル（スコア集計）
 */
const determineOverallRiskByScore = (risks: DeliverableRisk[]): 'low' | 'medium' | 'high' => {
  if (risks.length === 0) return 'low';
  const score = risks.reduce((acc, r) => acc + (r.level === 'high' ? 3 : r.level === 'medium' ? 2 : 1), 0);
  if (risks.some(r => r.level === 'high')) return 'high';
  return score >= 4 ? 'medium' : 'low'; // 小～中規模の中リスク累積を medium に寄せる
};

/**
 * 成果物の追加・削除時のリスク変化を評価（priority / dependencies に集中）
 */
export const assessDeliverableChangeRisk = (
  deliverable: Deliverable,
  isAdding: boolean,
  currentSelection: Deliverable[],
  allDeliverables: Deliverable[],
  category: Phase
): { risks: DeliverableRisk[], recommendations: string[] } => {
  const risks: DeliverableRisk[] = [];
  const recommendations: string[] = [];
  const allById = new Map(allDeliverables.map(d => [d.id, d]));
  const selectedIds = new Set(currentSelection.map(d => d.id));

  if (!isAdding) {
    // 削除時：Must の削除は高リスク
    if (deliverable.priority === 'Must' && deliverable.category === category) {
      risks.push({
        id: 'removing-must',
        level: 'high',
        description: `このフェーズ（${category}）の必須成果物を削除しようとしています`,
        impact: '基礎情報が欠落し、後工程の判断・整合が困難になります。',
        mitigation: 'Must の削除は避け、代替や移管の方針を明確化してください。'
      });
      recommendations.push('Must は削除しないことを強く推奨します');
    }

    // 依存逆引き：この成果物に依存している選択済みの他成果物
    const dependents = currentSelection.filter(d => (d.dependencies ?? []).includes(deliverable.id));
    if (dependents.length > 0) {
      risks.push({
        id: 'breaking-dependencies',
        level: 'medium',
        description: '他の選択済み成果物が依存しています',
        impact: `${dependents.map(d => d.title).join('、')} が ${deliverable.title} に依存しているため、整合性が崩れます。`,
        mitigation: '依存先を代替で補うか、依存元も合わせて見直してください。'
      });
      recommendations.push('依存関係の波及影響を確認してください');
    }
  } else {
    // 追加時：未充足依存の注意喚起（推奨）
    const missingDeps = (deliverable.dependencies ?? []).filter(depId => !selectedIds.has(depId));
    if (missingDeps.length > 0) {
      const names = missingDeps.map(id => allById.get(id)?.title ?? id).join('、');
      recommendations.push(`${deliverable.title} の依存（${names}）も併せて選択してください`);
    }

    // フェーズ逆行依存（選択対象が下流へ依存）を軽リスクで示唆
    const phaseOrder: Record<Phase, number> = { '要件定義': 1, '基本設計': 2 };
    const crossPhase = (deliverable.dependencies ?? [])
      .map(id => allById.get(id))
      .filter((dep): dep is Deliverable => !!dep && dep.category && deliverable.category && phaseOrder[deliverable.category as Phase] < phaseOrder[dep.category as Phase]);

    if (crossPhase.length > 0) {
      risks.push({
        id: 'add-cross-phase-dependency',
        level: 'medium',
        description: 'フェーズ順序と矛盾する依存を含む成果物を追加しています',
        impact: `${deliverable.title} → ${crossPhase.map(d => d.title).join('、')} への依存は工程順序の破綻を招くおそれがあります。`,
        mitigation: '順序の見直し、または同フェーズで満たせる代替成果物の検討をしてください。'
      });
      recommendations.push('フェーズ順序と依存の整合を確認してください');
    }
  }

  return { risks, recommendations };
};
