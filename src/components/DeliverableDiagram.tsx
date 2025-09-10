import { Deliverable } from '@/types/deliverable';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Database, Layout, GitBranch, Shield, Settings, TestTube, Globe, Truck, Users } from 'lucide-react';

interface DeliverableDiagramProps {
  deliverables: Deliverable[];
  onDeliverableClick: (deliverable: Deliverable) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case '要件定義': return FileText;
    case '設計書': return Layout;
    case 'UI/UX設計': return Layout;
    case 'データ設計': return Database;
    case '業務分析': return GitBranch;
    case 'インフラ設計': return Settings;
    case 'テスト': return TestTube;
    case 'セキュリティ': return Shield;
    case 'インターフェース設計': return Globe;
    case '移行・運用': return Truck;
    default: return FileText;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Must': return 'bg-destructive text-destructive-foreground';
    case 'Should': return 'bg-warning text-warning-foreground';
    case 'Could': return 'bg-success text-success-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

export const DeliverableDiagram = ({ deliverables, onDeliverableClick }: DeliverableDiagramProps) => {
  // フェーズごとの成果物を整理
  const organizeByPhases = () => {
    const phases = [
      {
        id: 'requirements',
        name: '要件定義フェーズ',
        bgColor: 'bg-blue-50/50',
        borderColor: 'border-blue-200',
        items: deliverables.filter(d => d.category === '要件定義' || d.category === '業務分析')
      },
      {
        id: 'design',
        name: '設計フェーズ',
        bgColor: 'bg-green-50/50',
        borderColor: 'border-green-200',
        items: deliverables.filter(d => d.category === '設計書' || d.category === 'データ設計' || d.category === 'インフラ設計')
      },
      {
        id: 'ui',
        name: 'UI/UX設計フェーズ',
        bgColor: 'bg-purple-50/50',
        borderColor: 'border-purple-200',
        items: deliverables.filter(d => d.category === 'UI/UX設計')
      },
      {
        id: 'development',
        name: '開発・テストフェーズ',
        bgColor: 'bg-orange-50/50',
        borderColor: 'border-orange-200',
        items: deliverables.filter(d => d.category === 'テスト' || d.category === 'インターフェース設計')
      },
      {
        id: 'deployment',
        name: '運用・保守フェーズ',
        bgColor: 'bg-gray-50/50',
        borderColor: 'border-gray-200',
        items: deliverables.filter(d => d.category === '移行・運用' || d.category === 'セキュリティ')
      }
    ];
    return phases;
  };

  const phases = organizeByPhases();

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm p-6">
      <div className="space-y-6">
        {/* フロー図の説明 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            SI開発フロー & 成果物依存関係図
          </h2>
          <p className="text-muted-foreground">
            各フェーズの成果物とその依存関係を可視化
          </p>
        </div>

        {/* フェーズ別レイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {phases.map((phase, phaseIndex) => (
            <div
              key={phase.id}
              className={`${phase.bgColor} ${phase.borderColor} border-2 rounded-lg p-4 relative min-h-[500px]`}
            >
              {/* フェーズタイトル */}
              <div className="text-center mb-4 bg-white/90 rounded p-2 backdrop-blur-sm">
                <h3 className="font-bold text-sm text-foreground">
                  {phase.name}
                </h3>
                <div className="text-xs text-muted-foreground mt-1">
                  {phase.items.length}項目
                </div>
              </div>

              {/* 成果物カード */}
              <div className="space-y-3">
                {phase.items.map((deliverable, itemIndex) => {
                  const Icon = getCategoryIcon(deliverable.category);
                  
                  return (
                    <div
                      key={deliverable.id}
                      className={`bg-white rounded-lg border-2 shadow-sm p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        deliverable.isOptedIn 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted'
                      }`}
                      onClick={() => onDeliverableClick(deliverable)}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground leading-tight mb-2 line-clamp-2">
                            {deliverable.title}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-1.5 py-0.5 ${getPriorityColor(deliverable.priority)}`}
                            >
                              {deliverable.priority}
                            </Badge>
                            {deliverable.dependencies && deliverable.dependencies.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                依存: {deliverable.dependencies.length}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* フェーズ間の矢印 */}
              {phaseIndex < phases.length - 1 && (
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:block">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M4.5 2 L9 6 L4.5 10 L3 8.5 L6 6 L3 3.5 Z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* フロー方向の説明 */}
        <div className="flex items-center justify-center gap-6 mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4.5 2 L9 6 L4.5 10 L3 8.5 L6 6 L3 3.5 Z" />
              </svg>
            </div>
            <span>フェーズの流れ</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary bg-primary/5 rounded"></div>
            <span>選択済み成果物</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted rounded"></div>
            <span>未選択成果物</span>
          </div>
        </div>
      </div>
    </div>
  );
};