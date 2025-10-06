import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Template, TemplateSection, RiskAssessment, Deliverable } from '@/types/deliverable';
import { Copy, AlertTriangle, Info, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateCustomizationModalProps {
  template: Template;
  deliverable: Deliverable;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateCustomizationModal: React.FC<TemplateCustomizationModalProps> = ({
  template,
  deliverable,
  isOpen,
  onClose
}) => {
  const [sections, setSections] = useState<TemplateSection[]>(
    template.sections?.map(section => ({ ...section })) || []
  );
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { toast } = useToast();

  const handleSectionToggle = (sectionId: string, isSelected: boolean) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isSelected }
        : section
    ));
    
    // AI リスク判断のシミュレーション
    assessRisk(sections.map(s => 
      s.id === sectionId ? { ...s, isSelected } : s
    ));
  };

  const assessRisk = (updatedSections: TemplateSection[]) => {
    const selectedSections = updatedSections.filter(s => s.isSelected);
    const requiredSections = updatedSections.filter(s => s.required);
    const missingRequired = requiredSections.filter(rs => !selectedSections.find(s => s.id === rs.id));
    
    let overallRisk: 'low' | 'medium' | 'high' = 'low';
    const risks: any[] = [];
    const recommendations: string[] = [];

    if (missingRequired.length > 0) {
      overallRisk = 'high';
      risks.push({
        id: 'missing-required',
        level: 'high',
        description: '必須セクションが選択されていません',
        impact: `${missingRequired.map(s => s.name).join('、')} が含まれないため、成果物として不完全になる可能性があります。`,
        mitigation: '必須セクションを選択することを強く推奨します。'
      });
      recommendations.push('必須セクションをすべて選択してください');
    }

    const optionalSections = updatedSections.filter(s => !s.required);
    const unselectedOptional = optionalSections.filter(os => !selectedSections.find(s => s.id === os.id));
    
    if (unselectedOptional.length > 2) {
      overallRisk = overallRisk === 'high' ? 'high' : 'medium';
      risks.push({
        id: 'incomplete-documentation',
        level: 'medium',
        description: '多くの任意項目が除外されています',
        impact: '将来の保守性や理解のしやすさが低下する可能性があります。',
        mitigation: 'プロジェクトの性質に応じて必要な項目を追加選択することを検討してください。'
      });
      recommendations.push('プロジェクトに必要な任意項目の選択を検討してください');
    }

    setRiskAssessment({
      overallRisk,
      risks,
      recommendations
    });
  };

  const generateCustomizedContent = () => {
    const selectedSections = sections.filter(s => s.isSelected);
    
    // 基本的なMarkdownコンテンツ生成
    let customizedContent = `# ${template.name}\n\n`;
    customizedContent += `成果物: ${deliverable.title}\n\n`;
    customizedContent += `## 概要\n${deliverable.description}\n\n`;
    customizedContent += `## 目的\n${deliverable.purpose}\n\n`;
    
    selectedSections.forEach((section, index) => {
      customizedContent += `## ${index + 1}. ${section.name}\n\n`;
      customizedContent += `${section.description}\n\n`;
      customizedContent += `${section.content}\n\n`;
    });

    customizedContent += `\n---\nこのテンプレートを使用して${deliverable.title}を作成してください。\n`;

    return customizedContent;
  };

  const handleGenerate = () => {
    const content = generateCustomizedContent();
    setGeneratedContent(content);
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: "コピーしました",
        description: "カスタマイズされたテンプレートがクリップボードにコピーされました。",
      });
    }
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            テンプレートのカスタマイズ - {template.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customize">セクション選択</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedContent}>
              プレビュー
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* セクション選択 */}
          <div>
            <h3 className="text-lg font-medium mb-4">含めるセクションを選択してください</h3>
            <div className="space-y-3">
              {sections.map(section => (
                <div key={section.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={section.isSelected}
                    onCheckedChange={(checked) => 
                      handleSectionToggle(section.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{section.name}</span>
                      {section.required && (
                        <Badge variant="destructive" className="text-xs">必須</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {section.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      含まれる内容: {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* リスク評価 */}
          {riskAssessment && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                リスク評価
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span>総合リスクレベル:</span>
                <Badge className={getRiskColor(riskAssessment.overallRisk)}>
                  {riskAssessment.overallRisk === 'high' ? '高' : 
                   riskAssessment.overallRisk === 'medium' ? '中' : '低'}
                </Badge>
              </div>

              {riskAssessment.risks.map(risk => (
                <Alert key={risk.id} className="border-l-4 border-l-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">{risk.description}</div>
                      <div className="text-sm">
                        <strong>影響:</strong> {risk.impact}
                      </div>
                      {risk.mitigation && (
                        <div className="text-sm">
                          <strong>対策:</strong> {risk.mitigation}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}

              {riskAssessment.recommendations.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div>
                      <strong>推奨事項:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {riskAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">生成されたテンプレート</h3>
              <Button
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                コピー
              </Button>
            </div>
            <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generatedContent}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
          <Button 
            onClick={handleGenerate}
            className="flex items-center gap-2"
            disabled={sections.filter(s => s.isSelected).length === 0}
          >
            <Eye className="w-4 h-4" />
            プレビュー生成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};