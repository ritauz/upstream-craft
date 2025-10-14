import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Switch } from '@/presentation/components/ui/switch';
import { Deliverable } from '@/domain/entities/deliverable';
import { Eye, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliverableCardProps {
  deliverable: Deliverable;
  onToggleOptIn: (id: string, isOptedIn: boolean) => void;
  onViewDetails: (deliverable: Deliverable) => void;
}

export const DeliverableCard = ({
  deliverable,
  onToggleOptIn,
  onViewDetails
}: DeliverableCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-elevated",
        // ← isPhazeDlv を最優先にして常に bg-primary/25
        deliverable.isPhazeDlv
          ? "border-primary/20 bg-primary/25"
          : deliverable.isOptedIn
            ? "border-primary/20 bg-primary/5"
            : "border-border"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {deliverable.category}
              </Badge>
              {deliverable.type.includes('application') && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    "border-blue-200 text-blue-700 bg-blue-50"
                  )}
                >
                  アプリ
                </Badge>
              )}

              {deliverable.type.includes('infrastructure') && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    "border-green-200 text-green-700 bg-green-50"
                  )}
                >
                  インフラ
                </Badge>
              )}


              {
                deliverable.isPhazeDlv && (
                  <Badge
                    variant='outline'
                    className={cn(
                      "text-xs",
                      "border-blue-200 text-white bg-blue-700"
                    )}
                  >
                    工程成果物
                  </Badge>
                )
              }
            </div>
            <h3 className="font-semibold text-sm leading-snug text-card-foreground truncate">
              {deliverable.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!deliverable.isPhazeDlv && (
              <Switch
                checked={deliverable.isOptedIn}
                onCheckedChange={(checked) => onToggleOptIn(deliverable.id, checked)}
                className="data-[state=checked]:bg-primary"
              />
            )}
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
        </div>
      </CardContent>
    </Card>
  );
};