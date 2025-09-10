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
  // SVGのサイズ
  const svgWidth = 800;
  const svgHeight = 700;

  // 依存関係の線を描画する関数
  const renderDependencyLines = () => {
    const lines: JSX.Element[] = [];
    
    deliverables.forEach((deliverable) => {
      if (deliverable.dependencies && deliverable.position) {
        deliverable.dependencies.forEach((depId) => {
          const dependency = deliverables.find(d => d.id === depId);
          if (dependency && dependency.position) {
            lines.push(
              <line
                key={`${deliverable.id}-${depId}`}
                x1={dependency.position.x + 80}
                y1={dependency.position.y + 40}
                x2={deliverable.position.x + 80}
                y2={deliverable.position.y + 40}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            );
          }
        });
      }
    });
    
    return lines;
  };

  return (
    <div className="w-full bg-card rounded-lg border shadow-sm p-6">
      <div className="relative">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
          {/* 依存関係の線 */}
          {renderDependencyLines()}
          
          {/* 成果物ノード */}
          {deliverables.map((deliverable) => {
            if (!deliverable.position) return null;
            
            const Icon = getCategoryIcon(deliverable.category);
            
            return (
              <g key={deliverable.id}>
                {/* 成果物ボックス */}
                <foreignObject
                  x={deliverable.position.x}
                  y={deliverable.position.y}
                  width="160"
                  height="80"
                >
                  <Card 
                    className={`w-full h-full p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${
                      deliverable.isOptedIn 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted bg-muted/20'
                    }`}
                    onClick={() => onDeliverableClick(deliverable)}
                  >
                    <div className="flex items-start gap-2 h-full">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground leading-tight mb-1 line-clamp-2">
                          {deliverable.title}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs px-1.5 py-0.5 ${getPriorityColor(deliverable.priority)}`}
                        >
                          {deliverable.priority}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        
        {/* 凡例 */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-muted-foreground opacity-60" style={{borderTop: '2px dashed'}}></div>
            <span>依存関係</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary bg-primary/5 rounded"></div>
            <span>選択済み成果物</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-muted bg-muted/20 rounded"></div>
            <span>未選択成果物</span>
          </div>
        </div>
      </div>
    </div>
  );
};