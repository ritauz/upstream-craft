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

import { loadTemplateBody } from '@/infrastructure/content/template-loader';

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
  } | null>(null);

  // 「表示」押下のスピナー制御
  const [isFetching, setIsFetching] = useState<string | null>(null);

  const { toast } = useToast();

  /** 「表示」押下時: 最新版をロード */
  const handleTemplateAction = async (template: TemplateRef) => {
    try {
      setIsFetching(template.id);
      const content = await loadTemplateBody(template.id);

      setViewTemplate({
        id: template.id,
        name: template.name,
        content,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '不明なエラーです';
      toast({
        title: 'テンプレート取得に失敗しました',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsFetching(null);
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
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {deliverable.activity.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* テンプレート表示部分 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <FileText className="w-4 h-4" />
                利用テンプレート
              </h3>

              {viewTemplate && (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                    <Copy className="mr-2 h-4 w-4" />
                    テンプレートをコピー
                  </Button>
                </div>
              )}
            </div>

            {/* テンプレート一覧 */}
            <div className="grid sm:grid-cols-2 gap-2">
              {deliverable.templates.map(template => (
                <div
                  key={template.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="text-2xl" aria-hidden>
                    {getFormatIcon(template.format)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.id}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateAction(template)}
                        disabled={isFetching === template.id}
                      >
                        {isFetching === template.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            取得中...
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            表示
                          </>
                        )}
                      </Button>
                    </div>
                    {template.updatedAt && (
                      <p className="text-xs text-muted-foreground mt-1">最終更新: {template.updatedAt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 本文表示 */}
            {viewTemplate && (
              <div className="mt-4 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{viewTemplate.name}</h4>
                </div>
                <Separator className="mb-3" />
                <ScrollArea className="h-64 pr-4">
                  <article className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeSanitize({ ...sanitizeSchema, tagNames: sanitizeSchema.tagNames ?? [] }), rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {viewTemplate.content}
                    </ReactMarkdown>
                  </article>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
