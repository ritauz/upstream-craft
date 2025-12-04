import { Deliverable, TemplateRef } from '@/domain/entities/deliverable';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/presentation/components/ui/dialog';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import { FileText, Target, CheckSquare, Copy, Eye, Loader2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/presentation/hooks/use-toast';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { sanitizeSchema } from '@/infrastructure/utils/md-schema';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { listRevisions, getLatestRevision } from '@/infrastructure/content/manifest';
import { loadTemplateBody } from '@/infrastructure/content/template-loader';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/presentation/components/ui/select';

/** フォーマット別アイコン */
const getFormatIcon = (format: string) => {
  switch (format) {
    case 'Excel': return '📊';
    case 'Word': return '📄';
    case 'PDF': return '📋';
    case 'MD': return '📝';
    case 'MDX': return '📝';
    default: return '📄';
  }
};

// 最新（latest）と一致するリビジョンにだけ "Current (...)" を付ける
const toRevisionLabel = (rev: string, latest: string) =>
  rev === latest ? `Current (${rev})` : rev;

interface DeliverableModalProps {
  deliverable: Deliverable;
  onClose: () => void;
  allDeliverables: Deliverable[]; // 未使用だが型互換のため残置
}

export const DeliverableModal = ({ deliverable, onClose }: DeliverableModalProps) => {
  // テンプレプレビュー用の状態
  const [viewTemplate, setViewTemplate] = useState<{
    id: string;
    name: string;
    content: string;
    revisions: string[];       // 古い→新しい順
    selectedRevision: string;  // 現在選択中
    latestRevision: string;    // 最新
  } | null>(null);

  // 「表示」押下のスピナー制御
  const [isFetching, setIsFetching] = useState<string | null>(null);

  const { toast } = useToast();

  /** 「表示」押下時: リビジョン一覧→最新→本文ロード */
  const handleTemplateAction = async (template: TemplateRef) => {
    try {
      setIsFetching(template.id);
      const isLocal = import.meta.env.VITE_TPL_SOURCE === 'local';

      // 1) 全リビジョン（古い→新しい）を取得
      const revisions = isLocal ? ['Revyyyy.mm.dd hh:mm'] : await listRevisions(template.id);
      if (!revisions.length) throw new Error('リビジョンが見つかりません');

      // 2) 最新リビジョンを取得（念のためAPIで最新を確定）
      const latest = isLocal ? 'Revyyyy.mm.dd hh:mm' : await getLatestRevision(template.id);

      // 3) 最新で本文取得
      const content = await loadTemplateBody(template.id, { revision: latest });

      setViewTemplate({
        id: template.id,
        name: template.name,
        content,
        revisions,
        selectedRevision: latest,
        latestRevision: latest
      });
    } catch (e: any) {
      toast({
        title: 'テンプレート取得に失敗しました',
        description: e?.message ?? '不明なエラーです',
        variant: 'destructive'
      });
    } finally {
      setIsFetching(null);
    }
  };

  /** リビジョン変更時: 本文を差し替え */
  const handleChangeRevision = async (nextRev: string) => {
    if (!viewTemplate) return;
    try {
      const content = await loadTemplateBody(viewTemplate.id, { revision: nextRev });
      // latest は listRevisions の末尾でも良いが、念のため state の latestRevision を維持
      setViewTemplate({
        ...viewTemplate,
        content,
        selectedRevision: nextRev
      });
    } catch (e: any) {
      toast({
        title: 'テンプレート取得に失敗しました',
        description: e?.message ?? '不明なエラーです',
        variant: 'destructive'
      });
    }
  };

  /** クリップボードコピー（画像はプレースホルダ化） */
  const mdForCopy = (md: string) =>
    md.replace(/!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, `> ここに画像を挿入`);

  const handleCopyTemplate = () => {
    if (!viewTemplate) return;
    const out = mdForCopy(viewTemplate.content);
    navigator.clipboard.writeText(out);
    toast({
      title: 'コピーしました',
      description: 'テンプレートがクリップボードにコピーされました。'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            {/* 左側: タイトルとカテゴリ */}
            <div>
              <DialogTitle className="text-xl font-bold mb-1">
                {deliverable.title}
              </DialogTitle>
              <DialogDescription asChild>
                <Badge variant="outline" className="w-fit">
                  {deliverable.category}
                </Badge>
              </DialogDescription>
            </div>

            {/* 右側: 実践ガイドボタン */}
            {deliverable.guideLink && (
              <Button
                asChild
                size="sm"
                className="shadow-sm ml-auto sm:mt-0 mt-2 m-4"
              >
                <a
                  href={deliverable.guideLink as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="実践ガイドを新しいタブで開く"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  実践ガイド
                </a>
              </Button>
            )}
          </div>
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
          {deliverable.activity && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-foreground mb-2">
                <CheckSquare className="w-4 h-4" />
                主な活動
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {deliverable.activity.map((act) =>
                (<li>
                  <p className="text-muted-foreground leading-relaxed">
                    {act}
                  </p>
                </li>)
                )}
              </ul>
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
              {deliverable.templates.map((template) => {
                const isBusy = isFetching === template.id;
                return (
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
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTemplateAction(template)}
                      className="flex items-center gap-2"
                      disabled={isBusy}
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          読み込み中
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          表示
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Template View Modal */}
      {viewTemplate && (
        <Dialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {/* 左: テンプレ名 */}
                <span className="truncate">{viewTemplate.name}</span>

                {/* 右: コピー */}
                <Button size="sm" onClick={handleCopyTemplate} className="flex items-center gap-2 m-2">
                  <Copy className="w-4 h-4" />
                  コピー
                </Button>
              </DialogTitle>

              <DialogDescription className="flex items-center gap-3 flex-wrap">
                {/* リビジョン選択 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">リビジョン</span>
                  <Select
                    value={viewTemplate.selectedRevision}
                    onValueChange={(v) => handleChangeRevision(v)}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="リビジョンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {viewTemplate.revisions.map((rev) => (
                        <SelectItem key={rev} value={rev}>
                          {toRevisionLabel(rev, viewTemplate.latestRevision)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogDescription>
            </DialogHeader>

            {/* 本文プレビュー */}
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4 prose prose-sm dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  [rehypeSanitize, sanitizeSchema],
                  rehypeRaw,
                ]}
              >
                {viewTemplate.content}
              </ReactMarkdown>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};
