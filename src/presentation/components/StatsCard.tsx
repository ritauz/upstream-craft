import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Deliverable } from '@/domain/entities/deliverable';
import { CheckSquare, FileText, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  deliverables: Deliverable[];
  filteredDeliverables: Deliverable[];
}

export const StatsCard = ({ deliverables, filteredDeliverables }: StatsCardProps) => {
  const totalCount = deliverables.length;
  const optedInCount = deliverables.filter(d => d.isOptedIn).length;
  const appCount = deliverables.filter(d => d.type.includes('application')).length;
  const infraCount = deliverables.filter(d => d.type.includes('infrastructure')).length;
  
  const filteredCount = filteredDeliverables.length;
  const filteredOptedInCount = filteredDeliverables.filter(d => d.isOptedIn).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            成果物概要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>総数:</span>
              <span className="font-semibold">{totalCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>表示中:</span>
              <span className="font-semibold">{filteredCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            選択状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>選択中:</span>
              <span className="font-semibold text-primary">{optedInCount}/{totalCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>表示中で選択:</span>
              <span className="font-semibold text-primary">{filteredOptedInCount}/{filteredCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            タイプ別
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              アプリ: {appCount}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              インフラ: {infraCount}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};