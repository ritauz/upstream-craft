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
  // 成果物の位置を定義
  const getDeliverablePositions = () => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    // レイアウト定義（階層構造）
    const layers = [
      // 第1層: 基礎となる成果物
      { y: 0, items: ['REQ_001'] }, // 要件定義書
      
      // 第2層: 要件定義書を基にする成果物
      { y: 1, items: ['REQ_002', 'BIZ_001'] }, // 基本設計書、業務フロー図
      
      // 第3層: 設計書系
      { y: 2, items: ['DES_001', 'DATA_001', 'INFRA_001'] }, // 詳細設計書、データベース設計書、システム構成図
      
      // 第4層: UI/テスト系
      { y: 3, items: ['UI_001', 'TEST_001', 'REP_001'] }, // 画面仕様書、テスト仕様書、帳票仕様書
      
      // 第5層: 専門的な成果物
      { y: 4, items: ['API_001', 'SEC_001', 'MIG_001', 'OPS_001'] } // API仕様書、セキュリティ設計書、移行計画書、運用手順書
    ];
    
    layers.forEach((layer, layerIndex) => {
      const itemWidth = 200;
      const itemSpacing = 250;
      const totalWidth = layer.items.length * itemSpacing;
      const startX = -totalWidth / 2;
      
      layer.items.forEach((itemId, itemIndex) => {
        positions[itemId] = {
          x: startX + (itemIndex * itemSpacing) + itemWidth / 2,
          y: layerIndex * 150
        };
      });
    });
    
    return positions;
  };

  const positions = getDeliverablePositions();

  // 依存関係の矢印を描画するためのSVG要素
  const renderArrows = () => {
    const arrows = [];
    
    deliverables.forEach(deliverable => {
      if (deliverable.dependencies && deliverable.dependencies.length > 0) {
        deliverable.dependencies.forEach(depId => {
          const fromPos = positions[depId];
          const toPos = positions[deliverable.id];
          
          if (fromPos && toPos) {
            const arrowId = `arrow-${depId}-${deliverable.id}`;
            arrows.push(
              <g key={arrowId}>
                {/* 矢印の線 */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y + 40}
                  x2={toPos.x}
                  y2={toPos.y - 10}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
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

        {/* 依存関係図 */}
        <div className="relative w-full overflow-auto">
          <div className="relative min-w-[1200px] min-h-[800px] bg-muted/10 rounded-lg p-8">
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

            {/* 成果物カード */}
            {deliverables.map(deliverable => {
              const position = positions[deliverable.id];
              if (!position) return null;

              const Icon = getCategoryIcon(deliverable.category);
              
              return (
                <div
                  key={deliverable.id}
                  className={`absolute bg-white rounded-lg border-2 shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 w-48 ${
                    deliverable.isOptedIn 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted'
                  }`}
                  style={{
                    left: position.x - 96, // カードの幅の半分
                    top: position.y,
                    zIndex: 2
                  }}
                  onClick={() => onDeliverableClick(deliverable)}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground leading-tight">
                          {deliverable.title}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 ${getPriorityColor(deliverable.priority)}`}
                      >
                        {deliverable.priority}
                      </Badge>
                      {deliverable.dependencies && deliverable.dependencies.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M4.5 2 L9 6 L4.5 10 L3 8.5 L6 6 L3 3.5 Z" />
                          </svg>
                          {deliverable.dependencies.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex items-center justify-center gap-6 mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg width="20" height="12" viewBox="0 0 20 12">
              <line x1="0" y1="6" x2="15" y2="6" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead-legend)" />
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
            <span>依存関係（インプット→アウトプット）</span>
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