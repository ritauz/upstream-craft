import { useState, useMemo, useEffect } from 'react';

import { DeliverableCard } from '@/presentation/components/DeliverableCard';
import { DeliverableModal } from '@/presentation/components/DeliverableModal';
import { HowToUseModal } from '@/presentation/components/HowToUseModal';
import { Button } from '@/presentation/components/ui/button';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { deliverableRepository } from '@/infrastructure/repositories/deliverable-repository';
import { Deliverable, DeliverableType } from '@/domain/entities/deliverable';
import { FileSpreadsheet, BookOpenText, AlertTriangle, Filter, Search, HelpCircle } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Link, useSearchParams } from 'react-router-dom';
import { assessDeliverableSelectionRisk } from '@/application/usecases/assess-deliverable-risk';

type Phase = '要件定義' | '基本設計';

const Index = ({ isAdmin: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- URL<->State 変換ヘルパ ---
  const PhaseToParam = { '要件定義': 'req', '基本設計': 'des' } as const;
  const ParamToPhase: Record<string, Phase> = { req: '要件定義', des: '基本設計' };

  const TypeToParam = { application: 'app', infrastructure: 'infra', all: 'all' } as const;
  const ParamToType: Record<string, DeliverableType | 'all'> = { app: 'application', infra: 'infrastructure', all: 'all' };

  const boolFromParam = (v: string | null) => v === '1';
  const boolToParam = (v: boolean) => (v ? '1' : null);

  // URL パラメータ → 初期値復元
  const selectedIdsFromUrl = useMemo(() => {
    const selectedParam = searchParams.get('selected');
    return selectedParam ? selectedParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const phaseFromUrl: Phase = (() => {
    const p = searchParams.get('phase');
    return p && ParamToPhase[p] ? ParamToPhase[p] : '要件定義';
  })();

  const typeFromUrl: DeliverableType | 'all' = (() => {
    const t = searchParams.get('type');
    return t && ParamToType[t] ? ParamToType[t] : 'all';
  })();

  const onlyFromUrl: boolean = boolFromParam(searchParams.get('only'));

  // deliverable 初期化（isPhazeDlv は常時 ON）
  const [deliverables, setDeliverables] = useState(() => {
    const allDeliverables = deliverableRepository.getAll();
    return allDeliverables.map(d => ({
      ...d,
      isOptedIn: selectedIdsFromUrl.includes(d.id) || d.isPhazeDlv === true,
    }));
  });

  // URLの変更に追従（外部遷移や戻る進むにも耐える）
  useEffect(() => {
    setDeliverables(prev =>
      prev.map(d => ({
        ...d,
        isOptedIn: selectedIdsFromUrl.includes(d.id) || d.isPhazeDlv === true,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedIdsFromUrl]);

  // UI 状態
  const [phase, setPhase] = useState<Phase>(phaseFromUrl);
  const [showRisk, setShowRisk] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<DeliverableType | 'all'>(typeFromUrl);
  const [showOptedInOnly, setShowOptedInOnly] = useState<boolean>(onlyFromUrl);
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false);
  const [riskAssessment, setRiskAssessment] =
    useState<ReturnType<typeof assessDeliverableSelectionRisk> | null>(null);

  // URLパラメータから詳細モーダル表示用の成果物を取得
  const selectedDeliverableId = searchParams.get('deliverable');
  const selectedDeliverable = useMemo(() => {
    if (!selectedDeliverableId) return null;
    return deliverables.find(d => d.id === selectedDeliverableId) || null;
  }, [selectedDeliverableId, deliverables]);

  // URL ⇄ state 双方向同期（phase/type/only）
  useEffect(() => {
    const p = searchParams.get('phase');
    if (p && ParamToPhase[p] && ParamToPhase[p] !== phase) setPhase(ParamToPhase[p]);

    const t = searchParams.get('type');
    if (t && ParamToType[t] && ParamToType[t] !== selectedType) setSelectedType(ParamToType[t]);

    const o = boolFromParam(searchParams.get('only'));
    if (o !== showOptedInOnly) setShowOptedInOnly(o);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // URL 更新ユーティリティ（replace で履歴汚染を抑制）
  const updateParams = (updater: (p: URLSearchParams) => void, replace = true) => {
    const p = new URLSearchParams(searchParams);
    updater(p);
    for (const [k, v] of Array.from(p.entries())) if (!v) p.delete(k);
    setSearchParams(p, { replace });
  };

  // リスク表示（フェーズ + タイプを渡す）
  useEffect(() => {
    if (!showRisk) {
      setRiskAssessment(null);
      return;
    }
    const selectedDeliverables = deliverables.filter(d => d.isOptedIn);
    const result = assessDeliverableSelectionRisk(
      deliverables,
      selectedDeliverables,
      phase,
      selectedType
    );
    setRiskAssessment(result);
  }, [deliverables, phase, selectedType, showRisk]);

  // 一覧の絞り込み（フェーズ一致必須）
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter(deliverable => {
      const matchesPhase = deliverable.category === phase;
      const matchesSearch =
        deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverable.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  // 選択切替で URL の selected を更新
  const handleToggleOptIn = (id: string, isOptedIn: boolean) => {
    setDeliverables(prev => {
      const updated = prev.map(d => (d.id === id ? { ...d, isOptedIn } : d));
      const selectedIds = updated.filter(d => d.isOptedIn).map(d => d.id);

      updateParams(p => {
        if (selectedIds.length) p.set('selected', selectedIds.join(','));
        else p.delete('selected');

        // deliverable は維持
        const cur = searchParams.get('deliverable');
        if (cur) p.set('deliverable', cur);
      });

      return updated;
    });
  };

  // 詳細モーダル開閉で URL を更新
  const handleViewDetails = (deliverable: Deliverable) => {
    updateParams(p => p.set('deliverable', deliverable.id));
  };

  const handleCloseModal = () => {
    updateParams(p => p.delete('deliverable'));
  };

  // フェーズ/タイプ/選択中のみ を URL と同期させるセット関数
  const setPhaseAndUrl = (next: Phase) => {
    setPhase(next);
    updateParams(p => p.set('phase', PhaseToParam[next]));
  };

  const setTypeAndUrl = (next: DeliverableType | 'all') => {
    setSelectedType(next);
    updateParams(p => p.set('type', TypeToParam[next]));
  };

  const toggleOnlyAndUrl = () => {
    const next = !showOptedInOnly;
    setShowOptedInOnly(next);
    updateParams(p => {
      const v = boolToParam(next);
      if (v) p.set('only', v);
      else p.delete('only');
    });
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
              <Button variant="outline" size="sm" onClick={() => setIsHowToUseModalOpen(true)}>
                <HelpCircle className="h-4 w-4 mr-2" />
                アプリの使い方
              </Button>
              <Button variant="outline" size="sm">
                <BookOpenText className="h-4 w-4 mr-2" />
                <a href={import.meta.env.VITE_GUIDE_URL} target="_blank" rel="noopener noreferrer">
                  Docs
                </a>
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
                onClick={() => setPhaseAndUrl('要件定義')}
              >
                要件定義
              </Button>
              <Button
                variant={phase === '基本設計' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPhaseAndUrl('基本設計')}
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
                onClick={() => setTypeAndUrl('application')}
              >
                アプリ
              </Button>
              <Button
                variant={selectedType === 'infrastructure' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTypeAndUrl('infrastructure')}
              >
                インフラ
              </Button>
              <Button
                variant={selectedType === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTypeAndUrl('all')}
              >
                全て
              </Button>
            </div>
          </div>

          {/* 選択中のみフィルター */}
          <Button
            variant={showOptedInOnly ? 'default' : 'outline'}
            size="sm"
            onClick={toggleOnlyAndUrl}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-1" />
            選択中のみ
          </Button>

          <Button
            variant={showRisk ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowRisk(prev => !prev)}
            className="ml-auto"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            {showRisk ? 'リスク表示中' : 'リスクを表示'}
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
        {showRisk && riskAssessment && Object.keys(riskAssessment.missingByTitle).length > 0 ? (
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
        ) : showRisk && riskAssessment && Object.keys(riskAssessment.missingByTitle).length === 0 && (
          <div className="mb-6">
            <Alert className="border-l-4 border-l-green-600">
              <AlertDescription className="text-sm">
                現在の選択では、未選択に起因するリスクは検出されませんでした。
              </AlertDescription>
            </Alert>
          </div>
        )}

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
                  updateParams(p => {
                    p.delete('type');
                    p.delete('only');
                  }, true);
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

      {/* How To Use Modal */}
      <HowToUseModal
        isOpen={isHowToUseModalOpen}
        onClose={() => setIsHowToUseModalOpen(false)}
      />
    </div>
  );
};

export default Index;
