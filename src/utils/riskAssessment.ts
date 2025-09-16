import { Deliverable, RiskAssessment, DeliverableRisk } from '@/types/deliverable';

/**
 * 選択された成果物に基づいてリスク評価を行う
 */
export const assessDeliverableSelectionRisk = (
  allDeliverables: Deliverable[],
  selectedDeliverables: Deliverable[]
): RiskAssessment => {
  const risks: DeliverableRisk[] = [];
  const recommendations: string[] = [];

  // 必須成果物のチェック
  const mustDeliverables = allDeliverables.filter(d => d.priority === 'Must');
  const selectedMust = selectedDeliverables.filter(d => d.priority === 'Must');
  
  if (selectedMust.length < mustDeliverables.length) {
    const missingMust = mustDeliverables.filter(md => 
      !selectedDeliverables.find(sd => sd.id === md.id)
    );
    
    risks.push({
      id: 'missing-must-deliverables',
      level: 'high',
      description: '必須成果物が不足しています',
      impact: `${missingMust.map(d => d.title).join('、')} が含まれていないため、プロジェクトの基盤となる重要な情報が不足し、後工程でのリスクが大幅に増加します。`,
      mitigation: '必須成果物をすべて選択することを強く推奨します。'
    });
    
    recommendations.push('すべての必須成果物を選択してください');
  }

  // 依存関係のチェック
  const dependencyIssues = checkDependencies(selectedDeliverables);
  if (dependencyIssues.length > 0) {
    risks.push({
      id: 'dependency-violations',
      level: 'high',
      description: '依存関係に問題があります',
      impact: `${dependencyIssues.join('、')} の依存関係が満たされていないため、成果物の品質や整合性に問題が生じる可能性があります。`,
      mitigation: '依存する成果物を追加で選択するか、選択を見直してください。'
    });
    
    recommendations.push('依存関係を確認し、必要な成果物を追加選択してください');
  }

  // アプリケーション vs インフラのバランスチェック
  const appDeliverables = selectedDeliverables.filter(d => d.type === 'application');
  const infraDeliverables = selectedDeliverables.filter(d => d.type === 'infrastructure');
  
  if (appDeliverables.length > 0 && infraDeliverables.length === 0) {
    risks.push({
      id: 'missing-infrastructure',
      level: 'medium',
      description: 'インフラ関連の成果物が不足しています',
      impact: 'システム運用時のトラブルや性能問題が発生しやすくなる可能性があります。',
      mitigation: 'システム構成図や運用手順書などのインフラ成果物を検討してください。'
    });
    
    recommendations.push('インフラ関連の成果物も検討してください');
  }

  // テスト成果物のチェック
  const hasTestDeliverables = selectedDeliverables.some(d => d.category === 'テスト');
  const hasApplicationDeliverables = appDeliverables.length > 0;
  
  if (hasApplicationDeliverables && !hasTestDeliverables) {
    risks.push({
      id: 'missing-test-deliverables',
      level: 'medium',
      description: 'テスト関連の成果物が含まれていません',
      impact: 'システムの品質保証が不十分になり、本番環境での障害リスクが高まります。',
      mitigation: 'テスト仕様書の追加を検討してください。'
    });
    
    recommendations.push('品質保証のためテスト仕様書の選択を検討してください');
  }

  // セキュリティ成果物のチェック
  const hasSecurityDeliverables = selectedDeliverables.some(d => d.category === 'セキュリティ');
  const totalSelectedCount = selectedDeliverables.length;
  
  if (totalSelectedCount > 3 && !hasSecurityDeliverables) {
    risks.push({
      id: 'missing-security',
      level: 'low',
      description: 'セキュリティ関連の成果物が含まれていません',
      impact: 'セキュリティ要件の検討が不十分になる可能性があります。',
      mitigation: 'システムの重要度に応じてセキュリティ設計書を検討してください。'
    });
    
    recommendations.push('システムの重要度に応じてセキュリティ成果物も検討してください');
  }

  // 総合リスクレベルの決定
  const overallRisk = determineOverallRisk(risks);

  return {
    overallRisk,
    risks,
    recommendations
  };
};

/**
 * 依存関係の問題をチェック
 */
const checkDependencies = (selectedDeliverables: Deliverable[]): string[] => {
  const issues: string[] = [];
  const selectedIds = new Set(selectedDeliverables.map(d => d.id));

  selectedDeliverables.forEach(deliverable => {
    if (deliverable.dependencies) {
      deliverable.dependencies.forEach(depId => {
        if (!selectedIds.has(depId)) {
          const depTitle = selectedDeliverables.find(d => d.id === depId)?.title || depId;
          issues.push(`${deliverable.title} が依存する ${depTitle}`);
        }
      });
    }
  });

  return issues;
};

/**
 * 総合リスクレベルを決定
 */
const determineOverallRisk = (risks: DeliverableRisk[]): 'low' | 'medium' | 'high' => {
  if (risks.some(r => r.level === 'high')) return 'high';
  if (risks.some(r => r.level === 'medium')) return 'medium';
  return 'low';
};

/**
 * 成果物の追加・削除時のリスク変化を評価
 */
export const assessDeliverableChangeRisk = (
  deliverable: Deliverable,
  isAdding: boolean,
  currentSelection: Deliverable[]
): { risks: DeliverableRisk[], recommendations: string[] } => {
  const risks: DeliverableRisk[] = [];
  const recommendations: string[] = [];

  if (!isAdding) {
    // 削除時のリスク評価
    if (deliverable.priority === 'Must') {
      risks.push({
        id: 'removing-must',
        level: 'high',
        description: '必須成果物を削除しようとしています',
        impact: 'プロジェクトの基盤となる重要な情報が欠落し、後工程で大きな問題が発生する可能性があります。',
        mitigation: '必須成果物の削除は推奨されません。'
      });
      
      recommendations.push('必須成果物は削除しないことを強く推奨します');
    }

    // この成果物に依存している他の成果物をチェック
    const dependentDeliverables = currentSelection.filter(d => 
      d.dependencies?.includes(deliverable.id)
    );
    
    if (dependentDeliverables.length > 0) {
      risks.push({
        id: 'breaking-dependencies',
        level: 'medium',
        description: '他の成果物が依存しています',
        impact: `${dependentDeliverables.map(d => d.title).join('、')} が ${deliverable.title} に依存しているため、整合性の問題が発生する可能性があります。`,
        mitigation: '依存している成果物も併せて削除するか、依存関係を再検討してください。'
      });
      
      recommendations.push('依存している他の成果物への影響を確認してください');
    }
  } else {
    // 追加時のリスク評価（主に推奨事項）
    if (deliverable.dependencies && deliverable.dependencies.length > 0) {
      const missingDeps = deliverable.dependencies.filter(depId => 
        !currentSelection.find(d => d.id === depId)
      );
      
      if (missingDeps.length > 0) {
        recommendations.push(`${deliverable.title} が依存する成果物（${missingDeps.join('、')}）も選択することを検討してください`);
      }
    }
  }

  return { risks, recommendations };
};