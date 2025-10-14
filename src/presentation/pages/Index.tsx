import { useState, useMemo, useEffect } from 'react';

import { DeliverableCard } from '@/presentation/components/DeliverableCard';
import { DeliverableModal } from '@/presentation/components/DeliverableModal';
import { StatsCard } from '@/presentation/components/StatsCard';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { deliverableRepository } from '@/infrastructure/repositories/deliverable-repository';
import { Deliverable, DeliverableType } from '@/domain/entities/deliverable';
import { FileSpreadsheet, Settings, Download, GitBranch, BookOpenText, AlertTriangle, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Input } from '@/presentation/components/ui/input';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { assessDeliverableSelectionRisk } from '@/application/usecases/assess-deliverable-risk';

type Phase = '要件定義' | '基本設計';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URLパラメータから選択されている成果物のIDリストを取得
  const selectedIdsFromUrl = useMemo(() => {
    const selectedParam = searchParams.get('selected');
    return selectedParam ? selectedParam.split(',') : [];
  }, [searchParams]);

  // deliverableの初期状態をURLパラメータから復元
  const [deliverables, setDeliverables] = useState(() => {
    const allDeliverables = deliverableRepository.getAll();
    return allDeliverables.map(d => ({
      ...d,
      isOptedIn: selectedIdsFromUrl.includes(d.id)
    }));
  });

  // URLパラメータが変更されたら選択状態を同期
  useEffect(() => {
    setDeliverables(prev =>
      prev.map(d => ({
        ...d,
        isOptedIn: selectedIdsFromUrl.includes(d.id) || d.isPhazeDlv === true,
      }))
    );
  }, [selectedIdsFromUrl]);

  // 追加: フェーズ選択（初期値は要件定義）
  const [phase, setPhase] = useState<Phase>('要件定義');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<DeliverableType | 'all'>('all');
  const [showOptedInOnly, setShowOptedInOnly] = useState(false);
  const [riskAssessment, setRiskAssessment] =
    useState<ReturnType<typeof assessDeliverableSelectionRisk> | null>(null);

  // URLパラメータから詳細モーダル表示用の成果物を取得
  const selectedDeliverableId = searchParams.get('deliverable');
  const selectedDeliverable = useMemo(() => {
    if (!selectedDeliverableId) return null;
    return deliverables.find(d => d.id === selectedDeliverableId) || null;
  }, [selectedDeliverableId, deliverables]);

  // リスク評価（フェーズ + タイプを渡す）
  const handleAssessRisk = () => {
    const selectedDeliverables = deliverables.filter(d => d.isOptedIn);
    const result = assessDeliverableSelectionRisk(
      deliverables,
      selectedDeliverables,
      phase,
      selectedType
    );
    setRiskAssessment(result);
  };

  useEffect(() => {
    // 選択や絞り込みが変わったら前回の結果を無効化
    setRiskAssessment(null);
  }, [deliverables, phase, selectedType]);


  // 一覧の絞り込みに「フェーズ一致」を必須条件として追加
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter(deliverable => {
      const matchesPhase = deliverable.category === phase;
      const matchesSearch =
        deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverable.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 既存のカテゴリフィルタは“追加フィルタ”として扱う（必要ならallにしておけばOK）
      const matchesCategory = selectedCategory === 'all' || deliverable.category === selectedCategory;

      const matchesType = selectedType === 'all' || deliverable.type.includes(selectedType);
      const matchesOptIn = !showOptedInOnly || deliverable.isOptedIn;

      return (
        matchesPhase &&
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesOptIn
      );
    });
  }, [deliverables, phase, searchTerm, selectedCategory, selectedType, showOptedInOnly]);

  const handleToggleOptIn = (id: string, isOptedIn: boolean) => {
    setDeliverables(prev => {
      const updated = prev.map(d => (d.id === id ? { ...d, isOptedIn } : d));

      // 選択されている成果物のIDリストを作成してURLを更新
      const selectedIds = updated.filter(d => d.isOptedIn).map(d => d.id);
      const newParams = new URLSearchParams(searchParams);

      if (selectedIds.length > 0) {
        newParams.set('selected', selectedIds.join(','));
      } else {
        newParams.delete('selected');
      }

      // deliverableパラメータは保持
      if (searchParams.get('deliverable')) {
        newParams.set('deliverable', searchParams.get('deliverable')!);
      }

      setSearchParams(newParams);

      return updated;
    });
  };

  const handleViewDetails = (deliverable: Deliverable) => {
    setSearchParams({ deliverable: deliverable.id });
    const newParams = new URLSearchParams(searchParams);
    newParams.set('deliverable', deliverable.id);
    setSearchParams(newParams);
  };

  const handleCloseModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('deliverable');
    setSearchParams(newParams);
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
              <Button variant="outline" size="sm">
                <BookOpenText className="h-4 w-4 mr-2" />
                <Link to={`https://www.notion.so/278e8bc3d80d807695a2d7a2ec766aff?source=copy_link`}>Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* フェーズ選択とフィルター */}
        <div className="mb-4 flex items-center gap-4">
          {/* フェーズ選択 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">フェーズ:</span>
            <div className="flex rounded-lg border p-1 bg-card">
              <Button
                variant={phase === '要件定義' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setPhase('要件定義');
                }}
              >
                要件定義
              </Button>
              <Button
                variant={phase === '基本設計' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setPhase('基本設計');
                }}
              >
                基本設計
              </Button>
            </div>
          </div>

          {/* タイプ選択 (アプリ/インフラ) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">タイプ:</span>
            <div className="flex rounded-lg border p-1 bg-card">
              <Button
                variant={selectedType === 'application' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('application')}
              >
                アプリ
              </Button>
              <Button
                variant={selectedType === 'infrastructure' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('infrastructure')}
              >
                インフラ
              </Button>
              <Button
                variant={selectedType === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                全て
              </Button>
            </div>
          </div>

          {/* 選択中のみフィルター */}
          <Button
            variant={showOptedInOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOptedInOnly(!showOptedInOnly)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-1" />
            選択中のみ
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleAssessRisk}
            className="ml-auto"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            リスクを評価
          </Button>

          {/* 検索窓 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="成果物を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>


        {/* Risk Assessment Display */}
        {riskAssessment && Object.keys(riskAssessment.missingByTitle).length > 0 ? (
          <div className="mb-6">
            <Alert className="border-l-4 border-l-warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <strong>プロジェクトリスク:</strong>
                    <span className="text-xs text-muted-foreground">
                      （フェーズ: {phase} / タイプ: {selectedType === 'all' ? '全て' : selectedType === 'application' ? 'アプリ' : 'インフラ'}）
                    </span>
                  </div>

                  {/* 箇条書き（各行の末尾に「未選択: タイトル」） */}
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {Object.entries(riskAssessment.missingByTitle).map(([title, line]) => (
                      <li key={title}>
                        {line}{' '}
                        <span className="text-xs text-muted-foreground">（未選択: {title}）</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : riskAssessment && Object.keys(riskAssessment.missingByTitle).length === 0 && (<div className="mb-6">
          <Alert className="border-l-4 border-l-green-600">
            <AlertDescription className="text-sm">
              現在の選択では、未選択に起因するリスクは検出されませんでした。
            </AlertDescription>
          </Alert>
        </div>)}


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

      {/* Detail Modal */}
      {selectedDeliverable && (
        <DeliverableModal
          deliverable={selectedDeliverable}
          onClose={handleCloseModal}
          allDeliverables={deliverables}
        />
      )}
    </div>);
};
export default Index;