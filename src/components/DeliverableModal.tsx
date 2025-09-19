import { Deliverable, Template } from '@/types/deliverable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Target, CheckSquare, Settings } from 'lucide-react';
import { TemplateCustomizationModal } from './TemplateCustomizationModal';
import { useState } from 'react';

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

  const handleTemplateAction = (template: Template) => {
    if (template.sections && template.sections.length > 0) {
      // カスタマイズ可能なテンプレートの場合、カスタマイズモーダルを開く
      setCustomizationTemplate(template);
    } else {
      // 直接ダウンロード
      handleDownload('', template.name);
    }
  };

  const handleDownload = (templateUrl: string, templateName: string) => {
    // Markdownファイルの実際のダウンロード処理
    const content = `# ${templateName}

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

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deliverable.title}_${templateName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCustomizedDownload = (customizedContent: string) => {
    const blob = new Blob([customizedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deliverable.title}_カスタマイズ済み.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                        <Download className="w-4 h-4" />
                        ダウンロード
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
          isOpen={!!customizationTemplate}
          onClose={() => setCustomizationTemplate(null)}
          onDownload={handleCustomizedDownload}
        />
      )}
    </Dialog>
  );
};