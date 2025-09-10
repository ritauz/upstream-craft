import { Deliverable } from '@/types/deliverable';

export const deliverables: Deliverable[] = [
  // Must - 必須成果物
  {
    id: '1',
    title: '要件定義書',
    description: '顧客の業務要件やシステム要件を明確に定義し、プロジェクトの目標と範囲を確定する',
    purpose: 'ステークホルダー間での認識共有とプロジェクトスコープの明確化',
    requirements: '業務要件、機能要件、非機能要件、制約条件を網羅的に記載',
    priority: 'Must',
    category: '要件定義',
    templates: [
      { id: 't1-1', name: '要件定義書テンプレート', format: 'Excel', url: '#', hasSample: true },
      { id: 't1-2', name: '要件定義書（Word版）', format: 'Word', url: '#', hasSample: true }
    ],
    isOptedIn: true,
    dependencies: [],
    position: { x: 200, y: 100 }
  },
  {
    id: '2',
    title: '基本設計書',
    description: 'システムの全体構成と基本的な設計方針を定義する',
    purpose: '開発チーム全体での設計方針統一と詳細設計の指針提供',
    requirements: 'システム構成図、機能構成、インターフェース設計、データ設計の基本方針',
    priority: 'Must',
    category: '設計書',
    templates: [
      { id: 't2-1', name: '基本設計書テンプレート', format: 'Excel', url: '#', hasSample: true },
      { id: 't2-2', name: '基本設計書（Word版）', format: 'Word', url: '#', hasSample: false }
    ],
    isOptedIn: true,
    dependencies: ['1'],
    position: { x: 200, y: 250 }
  },
  {
    id: '3',
    title: '画面仕様書',
    description: 'ユーザーインターフェースの詳細仕様を定義する',
    purpose: '画面の動作仕様とデザインの明確化、開発者とデザイナー間の認識統一',
    requirements: '画面レイアウト、項目仕様、画面遷移、入力チェック仕様',
    priority: 'Must',
    category: 'UI/UX設計',
    templates: [
      { id: 't3-1', name: '画面仕様書テンプレート', format: 'Excel', url: '#', hasSample: true },
      { id: 't3-2', name: '画面仕様書（PowerPoint版）', format: 'PDF', url: '#', hasSample: true }
    ],
    isOptedIn: true,
    dependencies: ['1', '2'],
    position: { x: 500, y: 150 }
  },
  {
    id: '4',
    title: 'データベース設計書',
    description: 'データベースの論理設計と物理設計を定義する',
    purpose: 'データの整合性確保と効率的なデータアクセスの実現',
    requirements: 'ER図、テーブル定義、インデックス設計、制約定義',
    priority: 'Must',
    category: 'データ設計',
    templates: [
      { id: 't4-1', name: 'DB設計書テンプレート', format: 'Excel', url: '#', hasSample: true }
    ],
    isOptedIn: true,
    dependencies: ['1', '2'],
    position: { x: 500, y: 300 }
  },
  {
    id: '5',
    title: '業務フロー図',
    description: '業務プロセスの流れとシステムとの関係を可視化する',
    purpose: '業務とシステムの関係性明確化と業務効率化ポイントの特定',
    requirements: 'As-Is/To-Beフロー、システム処理ポイント、承認フロー',
    priority: 'Must',
    category: '業務分析',
    templates: [
      { id: 't5-1', name: '業務フロー図テンプレート', format: 'PDF', url: '#', hasSample: true },
      { id: 't5-2', name: 'Visio形式テンプレート', format: 'Excel', url: '#', hasSample: false }
    ],
    isOptedIn: true,
    dependencies: ['1'],
    position: { x: 50, y: 250 }
  },

  // Should - 重要成果物
  {
    id: '6',
    title: '詳細設計書',
    description: 'プログラム単位での詳細な設計仕様を定義する',
    purpose: '実装レベルでの設計品質向上とコーディング効率化',
    requirements: 'クラス設計、メソッド仕様、例外処理設計',
    priority: 'Should',
    category: '設計書',
    templates: [
      { id: 't6-1', name: '詳細設計書テンプレート', format: 'Excel', url: '#', hasSample: true }
    ],
    isOptedIn: false,
    dependencies: ['2'],
    position: { x: 200, y: 400 }
  },
  {
    id: '7',
    title: 'システム構成図',
    description: 'システム全体のアーキテクチャと構成要素を定義する',
    purpose: 'システム全体像の把握とインフラ要件の明確化',
    requirements: 'ネットワーク構成、サーバー構成、ソフトウェア構成',
    priority: 'Should',
    category: 'インフラ設計',
    templates: [
      { id: 't7-1', name: 'システム構成図テンプレート', format: 'PDF', url: '#', hasSample: true }
    ],
    isOptedIn: true,
    dependencies: ['2'],
    position: { x: 350, y: 400 }
  },
  {
    id: '8',
    title: 'テスト仕様書',
    description: 'システムテストの範囲と詳細手順を定義する',
    purpose: 'テスト品質の向上と効率的なテスト実施',
    requirements: 'テストケース、テストデータ、期待結果、テスト手順',
    priority: 'Should',
    category: 'テスト',
    templates: [
      { id: 't8-1', name: 'テスト仕様書テンプレート', format: 'Excel', url: '#', hasSample: true }
    ],
    isOptedIn: false,
    dependencies: ['3', '4', '6'],
    position: { x: 650, y: 200 }
  },
  {
    id: '9',
    title: '帳票仕様書',
    description: '出力帳票の詳細仕様を定義する',
    purpose: '帳票レイアウトと出力ロジックの明確化',
    requirements: '帳票レイアウト、項目仕様、出力条件、ソート仕様',
    priority: 'Should',
    category: 'UI/UX設計',
    templates: [
      { id: 't9-1', name: '帳票仕様書テンプレート', format: 'Excel', url: '#', hasSample: true }
    ],
    isOptedIn: false,
    dependencies: ['3', '4'],
    position: { x: 650, y: 350 }
  },

  // Could - あれば良い成果物
  {
    id: '10',
    title: '移行計画書',
    description: '既存システムから新システムへの移行手順を定義する',
    purpose: '安全で効率的なシステム移行の実現',
    requirements: '移行手順、移行スケジュール、リスク対策、ロールバック手順',
    priority: 'Could',
    category: '移行・運用',
    templates: [
      { id: 't10-1', name: '移行計画書テンプレート', format: 'Word', url: '#', hasSample: false }
    ],
    isOptedIn: false,
    dependencies: ['4', '7'],
    position: { x: 500, y: 500 }
  },
  {
    id: '11',
    title: 'セキュリティ設計書',
    description: 'システムのセキュリティ要件と対策を定義する',
    purpose: 'セキュリティリスクの最小化とコンプライアンス対応',
    requirements: 'アクセス制御、暗号化方式、監査ログ、脆弱性対策',
    priority: 'Could',
    category: 'セキュリティ',
    templates: [
      { id: 't11-1', name: 'セキュリティ設計書テンプレート', format: 'Excel', url: '#', hasSample: false }
    ],
    isOptedIn: false,
    dependencies: ['2', '7'],
    position: { x: 350, y: 550 }
  },
  {
    id: '12',
    title: '運用手順書',
    description: 'システムの日常運用とメンテナンス手順を定義する',
    purpose: '安定したシステム運用とトラブル対応力向上',
    requirements: '日常運用手順、障害対応手順、バックアップ・復旧手順',
    priority: 'Could',
    category: '移行・運用',
    templates: [
      { id: 't12-1', name: '運用手順書テンプレート', format: 'Word', url: '#', hasSample: false }
    ],
    isOptedIn: false,
    dependencies: ['7', '10'],
    position: { x: 200, y: 550 }
  },
  {
    id: '13',
    title: 'API仕様書',
    description: '外部システムとの連携インターフェース仕様を定義する',
    purpose: 'システム間連携の品質向上と開発効率化',
    requirements: 'APIエンドポイント、リクエスト/レスポンス仕様、認証方式',
    priority: 'Could',
    category: 'インターフェース設計',
    templates: [
      { id: 't13-1', name: 'API仕様書テンプレート', format: 'Excel', url: '#', hasSample: false }
    ],
    isOptedIn: false,
    dependencies: ['2', '6'],
    position: { x: 50, y: 450 }
  }
];

export const categories = [
  '要件定義',
  '設計書',
  'UI/UX設計',
  'データ設計',
  '業務分析',
  'インフラ設計',
  'テスト',
  'セキュリティ',
  'インターフェース設計',
  '移行・運用'
];