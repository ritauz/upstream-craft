import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Deliverable, PriorityType } from '@/types/deliverable';
import { Download, FileText, Eye, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliverableCardProps {
  deliverable: Deliverable;
  onToggleOptIn: (id: string, isOptedIn: boolean) => void;
  onViewDetails: (deliverable: Deliverable) => void;
}

const getPriorityColor = (priority: PriorityType) => {
  switch (priority) {
    case 'Must':
      return 'must';
    case 'Should':
      return 'should';
    case 'Could':
      return 'could';
    default:
      return 'muted';
  }
};

export const DeliverableCard = ({ 
  deliverable, 
  onToggleOptIn, 
  onViewDetails 
}: DeliverableCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-elevated",
      deliverable.isOptedIn ? "border-primary/20 bg-primary/5" : "border-border"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs font-medium",
                  `bg-${getPriorityColor(deliverable.priority)} text-${getPriorityColor(deliverable.priority)}-foreground`
                )}
              >
                {deliverable.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {deliverable.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm leading-snug text-card-foreground truncate">
              {deliverable.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={deliverable.isOptedIn}
              onCheckedChange={(checked) => onToggleOptIn(deliverable.id, checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {deliverable.description}
        </p>
        
        {deliverable.purpose && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-card-foreground mb-1">目的・意義</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {deliverable.purpose}
            </p>
          </div>
        )}

        {deliverable.templates.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-card-foreground mb-2">テンプレート</h4>
            <div className="flex flex-wrap gap-1">
              {deliverable.templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => window.open(template.url, '_blank')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  {template.format}
                  {template.hasSample && (
                    <span className="ml-1 text-primary">+サンプル</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs flex-1"
            onClick={() => onViewDetails(deliverable)}
          >
            <Eye className="h-3 w-3 mr-1" />
            詳細
          </Button>
          {deliverable.checklist && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              チェックリスト
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};