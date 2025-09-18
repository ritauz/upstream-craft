/**
 * テキストファイルをダウンロードする
 */
export const downloadTextFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain;charset=utf-8'
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  // 新規タブを開かないよう明示的に _self
  link.target = '_self';
  link.rel = 'noopener';
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // revoke は少し遅延させると一部ブラウザで安定
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Markdownファイルをダウンロードする
 */
export const downloadMarkdown = (content: string, filename: string) => {
  const fullFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
  downloadTextFile(content, fullFilename, 'text/markdown;charset=utf-8');
};

/**
 * テンプレートファイル名を生成する
 */
export const generateTemplateFilename = (
  templateName: string,
  deliverableTitle: string
): string => {
  const sanitizedTemplateName = templateName.replace(/[^a-zA-Z0-9一-龯ぁ-んァ-ヶー\s_-]/g, '').trim();
  const sanitizedDeliverableTitle = deliverableTitle.replace(/[^a-zA-Z0-9一-龯ぁ-んァ-ヶー\s_-]/g, '').trim();
  return `${sanitizedDeliverableTitle}_${sanitizedTemplateName}`;
};

/**
 * 複数の成果物をZIPファイルとしてダウンロードする（将来的な拡張用）
 */
export const downloadDeliverablePackage = async (
  deliverables: Array<{ filename: string; content: string }>,
  packageName: string = 'deliverables_package'
) => {
  // 将来的にJSZipライブラリを使って実装予定
  console.log('ZIP download feature will be implemented in the future');
};
