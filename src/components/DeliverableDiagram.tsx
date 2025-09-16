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
  // 成果物を論理的なグループに分類
  const getLogicalGroups = () => {
    const groups = {
      requirements: {
        title: '要件・分析',
        color: 'bg-blue-50/80',
        borderColor: 'border-blue-200',
        position: { x: 50, y: 50 },
        items: deliverables.filter(d => ['1', '5'].includes(d.id)) // 要件定義書、業務フロー図
      },
      design: {
        title: '基本・詳細設計',
        color: 'bg-green-50/80',
        borderColor: 'border-green-200', 
        position: { x: 350, y: 50 },
        items: deliverables.filter(d => ['2', '6', '4'].includes(d.id)) // 基本設計書、詳細設計書、データベース設計書
      },
      uiux: {
        title: 'UI/UX・帳票',
        color: 'bg-purple-50/80',
        borderColor: 'border-purple-200',
        position: { x: 650, y: 50 },
        items: deliverables.filter(d => ['3', '9'].includes(d.id)) // 画面仕様書、帳票仕様書
      },
      infrastructure: {
        title: 'インフラ・API',
        color: 'bg-orange-50/80',
        borderColor: 'border-orange-200',
        position: { x: 50, y: 300 },
        items: deliverables.filter(d => ['7', '13'].includes(d.id)) // システム構成図、API仕様書
      },
      quality: {
        title: '品質・セキュリティ',
        color: 'bg-red-50/80',
        borderColor: 'border-red-200',
        position: { x: 350, y: 300 },
        items: deliverables.filter(d => ['8', '12'].includes(d.id)) // テスト仕様書、セキュリティ設計書
      },
      operations: {
        title: '運用・保守',
        color: 'bg-gray-50/80',
        borderColor: 'border-gray-200',
        position: { x: 650, y: 300 },
        items: deliverables.filter(d => ['10', '11'].includes(d.id)) // 移行計画書、運用手順書
      }
    };
    
    return groups;
  };

  const groups = getLogicalGroups();
  
  // 依存関係の矢印を描画
  const renderArrows = () => {
    const arrows = [];
    
    // グループ内の成果物の位置を計算（カードの端点を考慮）
    const getDeliverableConnectionPoint = (deliverableId: string, isSource: boolean) => {
      for (const [groupKey, group] of Object.entries(groups)) {
        const itemIndex = group.items.findIndex(item => item.id === deliverableId);
        if (itemIndex !== -1) {
          const cardWidth = 250;
          const cardHeight = 100;
          const cardX = group.position.x + 15; // グループ内のパディング
          const cardY = group.position.y + 60 + (itemIndex * 120); // グループタイトル + カード間隔
          
          // ソース（出力）の場合は右端、ターゲット（入力）の場合は左端
          if (isSource) {
            return {
              x: cardX + cardWidth, // 右端
              y: cardY + cardHeight / 2 // 中央
            };
          } else {
            return {
              x: cardX, // 左端
              y: cardY + cardHeight / 2 // 中央
            };
          }
        }
      }
      return null;
    };
    
    deliverables.forEach(deliverable => {
      if (deliverable.dependencies && deliverable.dependencies.length > 0) {
        deliverable.dependencies.forEach((depId, index) => {
          const fromPos = getDeliverableConnectionPoint(depId, true);
          const toPos = getDeliverableConnectionPoint(deliverable.id, false);
          
          if (fromPos && toPos) {
            // 矢印が重ならないように少しオフセットを追加
            const offsetY = (index - (deliverable.dependencies!.length - 1) / 2) * 10;
            const arrowId = `arrow-${depId}-${deliverable.id}`;
            
            // ベジェ曲線を使って滑らかな矢印を描画
            const midX = (fromPos.x + toPos.x) / 2;
            const curvature = Math.abs(toPos.x - fromPos.x) * 0.3;
            
            arrows.push(
              <g key={arrowId}>
                <path
                  d={`M ${fromPos.x} ${fromPos.y + offsetY} 
                      C ${fromPos.x + curvature} ${fromPos.y + offsetY}, 
                        ${toPos.x - curvature} ${toPos.y + offsetY}, 
                        ${toPos.x - 8} ${toPos.y + offsetY}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
              </g>
            );
          }
        });
      }
    });
    
    return arrows;
  };

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm p-6">
      <div className="space-y-6">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            成果物依存関係図
          </h2>
          <p className="text-muted-foreground">
            成果物間の依存関係を可視化し、作成順序を把握できます
          </p>
        </div>

        {/* 構造化された依存関係図 */}
        <div className="relative w-full">
          <div className="relative w-full bg-muted/10 rounded-lg p-6" style={{ minHeight: '700px', minWidth: '1000px' }}>
            {/* SVG for arrows */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="hsl(var(--primary))"
                  />
                </marker>
              </defs>
              {renderArrows()}
            </svg>

            {/* グループ化された成果物 */}
            {Object.entries(groups).map(([groupKey, group]) => (
              <div
                key={groupKey}
                className={`absolute ${group.color} ${group.borderColor} border-2 rounded-lg p-4 shadow-sm`}
                style={{
                  left: group.position.x,
                  top: group.position.y,
                  width: '280px',
                  minHeight: `${Math.max(200, group.items.length * 120 + 80)}px`,
                  zIndex: 0
                }}
              >
                {/* グループタイトル */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-foreground text-center bg-white/90 rounded px-2 py-1">
                    {group.title}
                  </h3>
                  <div className="text-xs text-muted-foreground text-center mt-1">
                    {group.items.length}項目
                  </div>
                </div>

                {/* グループ内の成果物 */}
                {group.items.map((deliverable, index) => {
                  const Icon = getCategoryIcon(deliverable.category);
                  
                  return (
                    <div
                      key={deliverable.id}
                      className={`relative mb-3 bg-white rounded-lg border-2 shadow-sm p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        deliverable.isOptedIn 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted'
                      }`}
                      style={{ 
                        zIndex: 10,
                        width: '250px',
                        minHeight: '100px'
                      }}
                      onClick={() => onDeliverableClick(deliverable)}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground leading-tight mb-2">
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
            ))}
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex items-center justify-center gap-6 mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg width="20" height="12" viewBox="0 0 20 12">
              <line x1="0" y1="6" x2="15" y2="6" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-legend)" />
              <defs>
                <marker
                  id="arrowhead-legend"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                </marker>
              </defs>
            </svg>
            <span>依存関係</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary bg-primary/5 rounded"></div>
            <span>選択済み</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted rounded"></div>
            <span>未選択</span>
          </div>
          <div className="text-sm text-muted-foreground">
            各グループ内の成果物をクリックして詳細を確認
          </div>
        </div>
      </div>
    </div>
  );
};