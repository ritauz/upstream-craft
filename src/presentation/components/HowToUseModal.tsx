import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { FileText, ToggleLeft, AlertTriangle, Share2 } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal = ({ isOpen, onClose }: HowToUseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">アプリの使い方</DialogTitle>
          <DialogDescription>
            このアプリケーションの基本的な使い方をご説明します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* テンプレート入手方法 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">テンプレートの入手方法</h3>
            </div>
            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
              <p>各成果物のマークダウンテンプレートは以下の手順で入手できます：</p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>成果物カードの<strong>「詳細」</strong>ボタンをクリック</li>
                <li>モーダル内の<strong>「表示」</strong>ボタンをクリック</li>
                <li>表示されたマークダウンテンプレートをコピーする</li>
                <li>プロジェクトで使用しているドキュメントツール（Markdown対応）に貼りつけて使用</li>
              </ol>
              <p className="pt-2 text-xs">
                💡 テンプレートはプロジェクトのニーズに合わせて自由にカスタマイズしてください
              </p>
            </div>
          </div>

          {/* 成果物の取捨選択 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">成果物の取捨選択</h3>
            </div>
            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
              <p>プロジェクトで使用する成果物を選択できます：</p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>各フェーズ（要件定義・基本設計）を選択</li>
                <li>成果物カード右上の<strong>スイッチ</strong>で必要な成果物を選択</li>
                <li><strong>「リスクを表示」</strong>ボタンをクリック</li>
                <li>選択した成果物に基づくプロジェクトリスクが表示されます</li>
              </ol>
            </div>
          </div>

          {/* URL共有 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">選択状態の共有</h3>
            </div>
            <div className="pl-7 space-y-2 text-sm text-muted-foreground">
              <p>
                成果物の選択状態はURLに反映されるため、そのままチームメンバーと共有できます。
                URLをコピーして送るだけで、同じ選択状態を再現できます。
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};