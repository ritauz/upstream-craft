import { useState, useMemo } from 'react';
import { FilterBar } from '@/components/FilterBar';
import { DeliverableCard } from '@/components/DeliverableCard';
import { StatsCard } from '@/components/StatsCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { deliverables as initialDeliverables } from '@/data/deliverables';
import { Deliverable, PriorityType, DeliverableType } from '@/types/deliverable';
import { FileSpreadsheet, Settings, Download, GitBranch, BookOpenText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assessDeliverableSelectionRisk } from '@/utils/riskAssessment';
import { downloadMarkdown } from '@/utils/fileDownload';
type Phase = '要件定義' | '基本設計';

const Index = () => {
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState(initialDeliverables);

  // 追加: フェーズ選択（初期値は要件定義）
  const [phase, setPhase] = useState<Phase>('要件定義');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<DeliverableType | 'all'>('all');
  const [showOptedInOnly, setShowOptedInOnly] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  // リスク評価（フェーズを渡す）
  const riskAssessment = useMemo(() => {
    const selectedDeliverables = deliverables.filter(d => d.isOptedIn);
    return assessDeliverableSelectionRisk(
      deliverables,
      selectedDeliverables,
      phase // ← 追加
    );
  }, [deliverables, phase]); // ← 依存に phase を追加

  // 一覧の絞り込みに「フェーズ一致」を必須条件として追加
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter(deliverable => {
      const matchesPhase = deliverable.category === phase; // ← 追加（必須）
      const matchesSearch =
        deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverable.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriority === 'all' || deliverable.priority === selectedPriority;

      // 既存のカテゴリフィルタは“追加フィルタ”として扱う（必要ならallにしておけばOK）
      const matchesCategory = selectedCategory === 'all' || deliverable.category === selectedCategory;

      const matchesType = selectedType === 'all' || deliverable.type === selectedType;
      const matchesOptIn = !showOptedInOnly || deliverable.isOptedIn;

      return (
        matchesPhase && // ← ここが効く
        matchesSearch &&
        matchesPriority &&
        matchesCategory &&
        matchesType &&
        matchesOptIn
      );
    });
  }, [deliverables, phase, searchTerm, selectedPriority, selectedCategory, selectedType, showOptedInOnly]);

  const handleToggleOptIn = (id: string, isOptedIn: boolean) => {
    setDeliverables(prev =>
      prev.map(d => (d.id === id ? { ...d, isOptedIn } : d))
    );
  };

  const handleViewDetails = (deliverable: Deliverable) => {
    setSelectedDeliverable(deliverable);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-card-foreground">成果物一覧</h1>
                <p className="text-sm text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/docs')}>
                <BookOpenText className="h-4 w-4 mr-2" />
                Docs
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                設定
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* 追加: フェーズのセグメントトグル */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">フェーズ:</span>
          <div className="flex rounded-lg border p-1 bg-card">
            <Button
              variant={phase === '要件定義' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setPhase('要件定義');
                // 必要ならカテゴリフィルタも同期させる場合は以下を有効化
                // setSelectedCategory('all'); // or setSelectedCategory('要件定義');
              }}
            >
              要件定義
            </Button>
            <Button
              variant={phase === '基本設計' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setPhase('基本設計');
                // setSelectedCategory('all'); // or setSelectedCategory('基本設計');
              }}
            >
              基本設計
            </Button>
          </div>
        </div>


        {/* Risk Assessment Display */}
        {riskAssessment && (
          <div className="mb-6">
            <Alert
              className={`border-l-4 ${riskAssessment.overallRisk === 'high'
                  ? 'border-l-destructive'
                  : riskAssessment.overallRisk === 'medium'
                    ? 'border-l-warning'
                    : 'border-l-success'
                }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <strong>プロジェクトリスク:</strong>
                    <Badge
                      className={
                        riskAssessment.overallRisk === 'high'
                          ? 'bg-destructive text-destructive-foreground'
                          : riskAssessment.overallRisk === 'medium'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-success text-success-foreground'
                      }
                    >
                      {riskAssessment.overallRisk === 'high'
                        ? '高'
                        : riskAssessment.overallRisk === 'medium'
                          ? '中'
                          : '低'}
                    </Badge>
                    {/* 追加: 今のフェーズを明示 */}
                    <span className="text-xs text-muted-foreground">
                      （フェーズ: {phase}）
                    </span>
                  </div>
                  {riskAssessment.recommendations.length > 0 && (
                    <div className="text-sm">
                      <strong>推奨:</strong>{' '}
                      {riskAssessment.recommendations.join('、')}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          showOptedInOnly={showOptedInOnly}
          onOptedInToggle={() => setShowOptedInOnly(!showOptedInOnly)}
        />

        <div className="mt-6">
          {filteredDeliverables.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                条件に一致する成果物が見つかりません
              </p>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriority('all');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setShowOptedInOnly(false);
                }}
              >
                フィルターをリセット
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeliverables.map(deliverable => (
                <DeliverableCard
                  key={deliverable.id}
                  deliverable={deliverable}
                  onToggleOptIn={handleToggleOptIn}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDeliverable} onOpenChange={() => setSelectedDeliverable(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDeliverable && <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedDeliverable.title}
                <Badge className={`bg-${selectedDeliverable.priority === 'Must' ? 'must' : selectedDeliverable.priority === 'Should' ? 'should' : 'could'}`}>
                  {selectedDeliverable.priority}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">説明</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDeliverable.description}
                </p>
              </div>

              {selectedDeliverable.purpose && <div>
                <h4 className="font-medium mb-2">目的・意義</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDeliverable.purpose}
                </p>
              </div>}

              {selectedDeliverable.requirements && <div>
                <h4 className="font-medium mb-2">存在意義</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDeliverable.requirements}
                </p>
              </div>}

              {selectedDeliverable.templates.length > 0 && <div>
                <h4 className="font-medium mb-2">利用可能なテンプレート</h4>
                <div className="space-y-2">
                  {selectedDeliverable.templates.map(template => <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        形式: {template.format}
                        {template.hasSample && ' | サンプル付き'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() =>
                      downloadMarkdown(template.name, template.content.markdown)
                    }>
                      <Download className="h-4 w-4 mr-1" />
                      ダウンロード
                    </Button>
                  </div>)}
                </div>
              </div>}

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">この成果物を選択</span>
                <Button variant={selectedDeliverable.isOptedIn ? "default" : "outline"} size="sm" onClick={() => {
                  handleToggleOptIn(selectedDeliverable.id, !selectedDeliverable.isOptedIn);
                  setSelectedDeliverable(prev => prev ? {
                    ...prev,
                    isOptedIn: !prev.isOptedIn
                  } : null);
                }}>
                  {selectedDeliverable.isOptedIn ? '選択中' : '選択する'}
                </Button>
              </div>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </div>);
};
export default Index;