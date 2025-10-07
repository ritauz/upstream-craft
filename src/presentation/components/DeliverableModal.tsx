import { Deliverable, Template } from '@/domain/entities/deliverable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import { FileText, Target, CheckSquare, Settings, Copy, Eye } from 'lucide-react';
import { TemplateCustomizationModal } from './TemplateCustomizationModal';
import { useState } from 'react';
import { useToast } from '@/presentation/hooks/use-toast';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';

interface DeliverableModalProps {
  deliverable: Deliverable;
  onClose: () => void;
  allDeliverables: Deliverable[]; // 依存関係の名前解決のために追加
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

export const DeliverableModal = ({ deliverable, onClose, allDeliverables }: DeliverableModalProps) => {
  const [customizationTemplate, setCustomizationTemplate] = useState<Template | null>(null);
  const [viewTemplate, setViewTemplate] = useState<{ name: string; content: string } | null>(null);
  const { toast } = useToast();

  const handleTemplateAction = (template: Template) => {
    if (template.sections && template.sections.length > 0) {
      // カスタマイズ可能なテンプレートの場合、カスタマイズモーダルを開く
      setCustomizationTemplate(template);
    } else {
      // テンプレート表示モーダルを開く
      const content = generateTemplateContent(template.name);
      setViewTemplate({ name: template.name, content });
    }
  };

  const generateTemplateContent = (templateName: string) => {
    return `# ${templateName}

成果物: ${deliverable.title}

## 概要
${deliverable.description}

## 目的
${deliverable.purpose}

${deliverable.requirements ? `## 記載要件
${deliverable.requirements}` : ''}

---
このテンプレートを使用して${deliverable.title}を作成してください。
`;
  };

  const handleCopyTemplate = () => {
    if (viewTemplate) {
      navigator.clipboard.writeText(viewTemplate.content);
      toast({
        title: "コピーしました",
        description: "テンプレートがクリップボードにコピーされました。",
      });
    }
  };
  const getDependencyTitle = (depId: string) => {
    const dep = allDeliverables.find(d => d.id === depId);
    return dep ? dep.title : depId;
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
          <DialogDescription asChild>
            <Badge variant="outline" className="w-fit">
              {deliverable.category}
            </Badge>
          </DialogDescription>
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
              <FileText className="w-4 h-4" />
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
                    onClick={() => handleTemplateAction(template)}
                    className="flex items-center gap-2"
                  >
                    {template.sections && template.sections.length > 0 ? (
                      <>
                        <Settings className="w-4 h-4" />
                        カスタマイズ
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        表示
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* インプット成果物 */}
          {deliverable.dependencies && deliverable.dependencies.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                インプットとなる成果物
              </h3>
              <div className="text-sm text-muted-foreground mb-3">
                この成果物を作成するために必要な前提成果物です
              </div>
              <div className="space-y-2">
                {deliverable.dependencies.map((depId, index) => (
                  <div
                    key={depId}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded border"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">
                      {getDependencyTitle(depId)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Template Customization Modal */}
      {customizationTemplate && (
        <TemplateCustomizationModal
          template={customizationTemplate}
          deliverable={deliverable}
          isOpen={!!customizationTemplate}
          onClose={() => setCustomizationTemplate(null)}
        />
      )}

      {/* Template View Modal */}
      {viewTemplate && (
        <Dialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{viewTemplate.name}</span>
                <Button
                  size="sm"
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  コピー
                </Button>
              </DialogTitle>
              <DialogDescription>
                テンプレートの内容を確認し、コピーボタンでクリップボードにコピーできます。
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {viewTemplate.content}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};