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
    type: 'application',
    templates: [
      { 
        id: 't1-1', 
        name: '要件定義書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名
### 1.2 プロジェクトの背景・目的
### 1.3 スコープ・対象範囲

## 2. 業務要件

### 2.1 現行業務フロー
### 2.2 課題・問題点
### 2.3 新業務フロー

## 3. 機能要件

### 3.1 必須機能
### 3.2 任意機能

## 4. 非機能要件

### 4.1 性能要件
### 4.2 セキュリティ要件
### 4.3 運用要件

## 5. 制約条件

### 5.1 技術制約
### 5.2 スケジュール制約
### 5.3 予算制約`,
          sections: ['プロジェクト概要', '業務要件', '機能要件', '非機能要件', '制約条件']
        },
        sections: [
          { id: 's1-1', name: 'プロジェクト概要', description: 'プロジェクトの基本情報', required: true, content: 'プロジェクト名、背景、目的、スコープ', isSelected: true },
          { id: 's1-2', name: '業務要件', description: '業務に関する要件', required: true, content: '現行業務、課題、新業務フロー', isSelected: true },
          { id: 's1-3', name: '機能要件', description: 'システムの機能要件', required: true, content: '必須機能、任意機能', isSelected: true },
          { id: 's1-4', name: '非機能要件', description: 'パフォーマンス等の要件', required: false, content: '性能、セキュリティ、運用要件', isSelected: true },
          { id: 's1-5', name: '制約条件', description: 'プロジェクトの制約', required: false, content: '技術、スケジュール、予算制約', isSelected: false }
        ]
      }
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
    type: 'application',
    templates: [
      { 
        id: 't2-1', 
        name: '基本設計書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# 基本設計書

## 1. システム概要

### 1.1 システム構成
### 1.2 アーキテクチャ概要

## 2. 機能設計

### 2.1 機能一覧
### 2.2 機能構成図

## 3. データ設計

### 3.1 データモデル
### 3.2 データフロー

## 4. インターフェース設計

### 4.1 外部システム連携
### 4.2 API設計方針

## 5. 技術方針

### 5.1 使用技術・フレームワーク
### 5.2 開発環境・ツール`,
          sections: ['システム概要', '機能設計', 'データ設計', 'インターフェース設計', '技術方針']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't3-1', 
        name: '画面仕様書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# 画面仕様書

## 1. 画面一覧

### 1.1 画面構成
### 1.2 画面遷移図

## 2. 画面詳細仕様

### 2.1 ログイン画面
### 2.2 メニュー画面
### 2.3 一覧画面
### 2.4 詳細画面

## 3. 共通仕様

### 3.1 入力チェック仕様
### 3.2 エラーメッセージ
### 3.3 権限制御`,
          sections: ['画面一覧', '画面詳細仕様', '共通仕様']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't4-1', 
        name: 'DB設計書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# データベース設計書

## 1. データベース概要

### 1.1 データベース構成
### 1.2 ER図

## 2. テーブル設計

### 2.1 テーブル一覧
### 2.2 テーブル定義詳細

## 3. インデックス設計

### 3.1 インデックス一覧
### 3.2 パフォーマンス考慮事項

## 4. 制約・参照整合性

### 4.1 制約定義
### 4.2 参照関係`,
          sections: ['データベース概要', 'テーブル設計', 'インデックス設計', '制約・参照整合性']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't5-1', 
        name: '業務フロー図作成ガイド', 
        format: 'MD', 
        url: 'https://miro.com/templates/business-process-mapping/', 
        hasSample: true,
        content: {
          markdown: `# 業務フロー図作成ガイド

## 推奨ツール

以下のツールを使用して業務フロー図を作成してください：

- **Miro**: [Business Process Mapping Template](https://miro.com/templates/business-process-mapping/)
- **Lucidchart**: [フローチャートツール](https://www.lucidchart.com/pages/flowchart-maker)
- **Draw.io**: [無料フロー図作成ツール](https://app.diagrams.net/)

## 作成手順

### 1. As-Is フロー作成
- 現在の業務プロセスを可視化
- 問題点・課題を明確化

### 2. To-Be フロー作成
- システム導入後の業務プロセス
- 効率化ポイントを明記

### 3. システム連携ポイント
- システム処理が発生する箇所を明記
- データの流れを可視化`,
          sections: ['推奨ツール', '作成手順']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't6-1', 
        name: '詳細設計書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# 詳細設計書

## 1. モジュール設計

### 1.1 モジュール構成
### 1.2 クラス図

## 2. プログラム仕様

### 2.1 クラス仕様
### 2.2 メソッド仕様

## 3. 例外処理設計

### 3.1 例外一覧
### 3.2 エラーハンドリング

## 4. 共通部品設計

### 4.1 共通ライブラリ
### 4.2 ユーティリティ`,
          sections: ['モジュール設計', 'プログラム仕様', '例外処理設計', '共通部品設計']
        }
      }
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
    type: 'infrastructure',
    templates: [
      { 
        id: 't7-1', 
        name: 'システム構成図テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# システム構成図

## 1. システム全体構成

### 1.1 システム概要図
### 1.2 ネットワーク構成

## 2. サーバー構成

### 2.1 本番環境
### 2.2 開発環境
### 2.3 テスト環境

## 3. ソフトウェア構成

### 3.1 ミドルウェア
### 3.2 アプリケーション

## 4. セキュリティ

### 4.1 ファイアウォール設定
### 4.2 アクセス制御`,
          sections: ['システム全体構成', 'サーバー構成', 'ソフトウェア構成', 'セキュリティ']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't8-1', 
        name: 'テスト仕様書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# テスト仕様書

## 1. テスト概要

### 1.1 テスト方針
### 1.2 テスト範囲

## 2. テストケース

### 2.1 単体テスト
### 2.2 結合テスト
### 2.3 システムテスト

## 3. テストデータ

### 3.1 テストデータ仕様
### 3.2 テストデータ作成手順

## 4. テスト実施

### 4.1 テスト手順
### 4.2 テスト結果記録`,
          sections: ['テスト概要', 'テストケース', 'テストデータ', 'テスト実施']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't9-1', 
        name: '帳票仕様書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: true,
        content: {
          markdown: `# 帳票仕様書

## 1. 帳票一覧

### 1.1 帳票概要
### 1.2 出力タイミング

## 2. 帳票詳細仕様

### 2.1 レイアウト仕様
### 2.2 項目仕様

## 3. 出力条件

### 3.1 抽出条件
### 3.2 ソート条件

## 4. 帳票サンプル

### 4.1 サンプルデータ
### 4.2 出力イメージ`,
          sections: ['帳票一覧', '帳票詳細仕様', '出力条件', '帳票サンプル']
        }
      }
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
    type: 'infrastructure',
    templates: [
      { 
        id: 't10-1', 
        name: '移行計画書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: false,
        content: {
          markdown: `# 移行計画書

## 1. 移行概要

### 1.1 移行目的
### 1.2 移行範囲

## 2. 移行計画

### 2.1 移行スケジュール
### 2.2 移行手順

## 3. リスク管理

### 3.1 リスク一覧
### 3.2 対策・軽減策

## 4. 移行作業

### 4.1 事前準備
### 4.2 移行実施
### 4.3 事後確認`,
          sections: ['移行概要', '移行計画', 'リスク管理', '移行作業']
        }
      }
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
    type: 'infrastructure',
    templates: [
      { 
        id: 't11-1', 
        name: 'セキュリティ設計書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: false,
        content: {
          markdown: `# セキュリティ設計書

## 1. セキュリティ方針

### 1.1 セキュリティ要件
### 1.2 適用法規・ガイドライン

## 2. アクセス制御

### 2.1 認証方式
### 2.2 認可方式

## 3. データ保護

### 3.1 暗号化方式
### 3.2 データ分類

## 4. 監査・ログ

### 4.1 監査ログ仕様
### 4.2 ログ監視`,
          sections: ['セキュリティ方針', 'アクセス制御', 'データ保護', '監査・ログ']
        }
      }
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
    type: 'infrastructure',
    templates: [
      { 
        id: 't12-1', 
        name: '運用手順書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: false,
        content: {
          markdown: `# 運用手順書

## 1. 日常運用

### 1.1 運用スケジュール
### 1.2 監視項目

## 2. 障害対応

### 2.1 障害レベル定義
### 2.2 エスカレーション

## 3. バックアップ・復旧

### 3.1 バックアップ手順
### 3.2 復旧手順

## 4. メンテナンス

### 4.1 定期メンテナンス
### 4.2 緊急メンテナンス`,
          sections: ['日常運用', '障害対応', 'バックアップ・復旧', 'メンテナンス']
        }
      }
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
    type: 'application',
    templates: [
      { 
        id: 't13-1', 
        name: 'API仕様書テンプレート（Markdown）', 
        format: 'MD', 
        url: '#', 
        hasSample: false,
        content: {
          markdown: `# API仕様書

## 1. API概要

### 1.1 API一覧
### 1.2 認証方式

## 2. エンドポイント仕様

### 2.1 ユーザー管理API
### 2.2 データ取得API

## 3. 共通仕様

### 3.1 リクエスト形式
### 3.2 レスポンス形式
### 3.3 エラーコード

## 4. サンプル

### 4.1 リクエスト例
### 4.2 レスポンス例`,
          sections: ['API概要', 'エンドポイント仕様', '共通仕様', 'サンプル']
        }
      }
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

export const deliverableTypes = [
  { value: 'application', label: 'アプリケーション成果物' },
  { value: 'infrastructure', label: 'インフラ成果物' }
];