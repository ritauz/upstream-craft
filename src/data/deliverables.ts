import { Deliverable } from '@/types/deliverable';

export const deliverables: Deliverable[] = [
  {
    id: '1',
    title: '上流工程の成果物一覧',
    description: '上流工程の成果物の漏れを防ぐことの成果物が重要で、どれが重要でないかを理解させる',
    purpose: '目的・役割・存在意義',
    requirements: '上流工程の成果物を網羅している、重要度ランク、依存関係（図の方がいい？）',
    priority: 'Must',
    category: '計画・管理',
    templates: [
      { id: 't1-1', name: '成果物一覧テンプレート', format: 'Excel', url: '#', hasSample: true },
      { id: 't1-2', name: '成果物一覧（MD版）', format: 'MD', url: '#', hasSample: true }
    ],
    isOptedIn: true
  },
  {
    id: '2',
    title: '成果物のテンプレート提供',
    description: '透明性と仕様の明確さと、作業効率の両立',
    purpose: '前提資料からある程度のプリセットができる、複数形式（Excel, MDなど）で出力できる、複数形式のオプトイン・アウト、項目のオプトイン・アウト',
    priority: 'Must',
    category: 'テンプレート',
    templates: [
      { id: 't2-1', name: 'テンプレート標準形式', format: 'Excel', url: '#', hasSample: true },
      { id: 't2-2', name: 'Markdown形式', format: 'MD', url: '#', hasSample: false }
    ],
    isOptedIn: true
  },
  {
    id: '3',
    title: '成果物とペアのチェックリスト',
    description: 'チェーリングされた成果物の状態に関わらず、一律のチェックリストを提供する',
    purpose: '解除ページへの導線、項目のオプトイン・アウト',
    priority: 'Should',
    category: '品質管理',
    templates: [
      { id: 't3-1', name: 'チェックリストテンプレート', format: 'Excel', url: '#', hasSample: true }
    ],
    isOptedIn: false
  },
  {
    id: '4',
    title: '成果物に対するレビュー指摘対応の記録（バージョン管理）',
    description: '変更の経緯と結果の記録',
    purpose: '変更の経緯と結果の記録',
    priority: 'Could',
    category: 'レビュー管理',
    templates: [
      { id: 't4-1', name: 'レビュー記録テンプレート', format: 'Excel', url: '#', hasSample: false }
    ],
    isOptedIn: false
  },
  {
    id: '8',
    title: '自動チェック機能',
    description: '無駄な対人レビュー時間をなくす',
    purpose: '即座応答、カジュアルな問い合わせ窓口',
    priority: 'Should',
    category: '自動化',
    templates: [],
    isOptedIn: true
  },
  {
    id: '12',
    title: '成果物の取捨選択機能',
    description: '一覧から自分の現実に適したサブセットを抽出し、調整する',
    purpose: '',
    priority: 'Could',
    category: 'カスタマイズ',
    templates: [],
    isOptedIn: false
  },
  {
    id: '9',
    title: 'テンプレを使用したシステム開発マネジメント研修',
    description: 'おススメの運用方法の周知と共有',
    purpose: '',
    priority: 'Could',
    category: '教育・研修',
    templates: [
      { id: 't9-1', name: '研修資料', format: 'PDF', url: '#', hasSample: false }
    ],
    isOptedIn: false
  },
  {
    id: '11',
    title: 'STDG主催のユーザー向けプライベートチャネル',
    description: 'ユーザー同士の交流の活性化',
    purpose: '',
    priority: 'Could',
    category: 'コミュニティ',
    templates: [],
    isOptedIn: false
  },
  {
    id: '10',
    title: 'STDGによる初回サポート',
    description: 'ユーザーの不安を取り除く',
    purpose: 'テンプレの使い方に限らない、PMとの全般的な相談',
    requirements: '即対応',
    priority: 'Must',
    category: 'サポート',
    templates: [],
    isOptedIn: true
  },
  {
    id: '7',
    title: '成果物の目的・使い方などのメタ情報のガイド（成果物を使ったマネジメント下）',
    description: '成果物を作って終わりにしない',
    purpose: '',
    requirements: '解説ページへの導線',
    priority: 'Must',
    category: 'ガイド',
    templates: [
      { id: 't7-1', name: 'ガイドドキュメント', format: 'PDF', url: '#', hasSample: true }
    ],
    isOptedIn: true
  }
];

export const categories = [
  '計画・管理',
  'テンプレート', 
  '品質管理',
  'レビュー管理',
  '自動化',
  'カスタマイズ',
  '教育・研修',
  'コミュニティ',
  'サポート',
  'ガイド'
];