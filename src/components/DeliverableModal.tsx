import { Deliverable } from '@/types/deliverable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Target, CheckSquare } from 'lucide-react';

interface DeliverableModalProps {
  deliverable: Deliverable;
  onClose: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Must': return 'bg-destructive text-destructive-foreground';
    case 'Should': return 'bg-warning text-warning-foreground';
    case 'Could': return 'bg-success text-success-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'Excel': return '📊';
    case 'Word': return '📄';
    case 'PDF': return '📋';
    case 'MD': return '📝';
    default: return '📄';
  }
};

export const DeliverableModal = ({ deliverable, onClose }: DeliverableModalProps) => {
  const handleDownload = (templateUrl: string, templateName: string) => {
    // 実際のダウンロード処理はここに実装
    console.log(`Download: ${templateName} from ${templateUrl}`);
    // 仮の処理として、アラートを表示
    alert(`${templateName} をダウンロードします`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <DialogTitle className="text-xl font-bold">
              {deliverable.title}
            </DialogTitle>
            <Badge 
              variant="secondary" 
              className={getPriorityColor(deliverable.priority)}
            >
              {deliverable.priority}
            </Badge>
          </div>
          <Badge variant="outline" className="w-fit">
            {deliverable.category}
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          {/* 概要 */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-2">
              <FileText className="w-4 h-4" />
              概要
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {deliverable.description}
            </p>
          </div>

          {/* 目的 */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-2">
              <Target className="w-4 h-4" />
              目的
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {deliverable.purpose}
            </p>
          </div>

          {/* 要件 */}
          {deliverable.requirements && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                <CheckSquare className="w-4 h-4" />
                記載要件
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {deliverable.requirements}
              </p>
            </div>
          )}

          <Separator />

          {/* テンプレート一覧 */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
              <Download className="w-4 h-4" />
              利用可能なテンプレート
            </h3>
            <div className="space-y-3">
              {deliverable.templates.map((template) => (
                <div 
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getFormatIcon(template.format)}</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {template.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {template.format}形式
                        {template.hasSample && (
                          <span className="ml-2 text-primary">• サンプル付き</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(template.url, template.name)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    ダウンロード
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 依存関係 */}
          {deliverable.dependencies && deliverable.dependencies.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                依存する成果物
              </h3>
              <div className="text-sm text-muted-foreground">
                この成果物を作成する前に、以下の成果物が必要です
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};