// src/data/deliverables.ts
import { Deliverable } from '@/types/deliverable'

export const deliverables: Deliverable[] = [
  // === 要件定義（Requirements） ===
  {
    id: 'req-01',
    title: '業務要件一覧書',
    description: '目的・KPI・アクター・トリガー・前提条件を整理した一覧',
    purpose: '業務ゴールの可視化と合意形成',
    requirements: '目的/KPI/アクター/トリガー/前提条件/アウトカム',
    priority: 'Must',
    category: '要件定義',
    type: 'application',
    templates: [
      {
        id: 'tpl-req-01', name: '業務要件一覧書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 業務要件一覧書', sections: ['目的', 'KPI', 'アクター', 'トリガー', '前提条件', 'アウトカム'] }
      }
    ],
    isOptedIn: true,
    dependencies: [],
    position: { x: 120, y: 120 }
  },
  {
    id: 'req-02',
    title: '機能要件一覧書',
    description: '機能ID・名称・説明・入出力・優先度を整理',
    purpose: '機能スコープの明確化と優先順位付け',
    requirements: '機能ID/名称/説明/入出力/優先度',
    priority: 'Must',
    category: '要件定義',
    type: 'application',
    templates: [
      {
        id: 'tpl-req-02', name: '機能要件一覧書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 機能要件一覧書', sections: ['機能ID', '名称', '説明', '入出力', '優先度'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-01'],
    position: { x: 320, y: 120 }
  },
  {
    id: 'req-03',
    title: 'ユースケース・業務フロー図',
    description: 'ユースケース図／業務フロー図（As-Is/To-Be）',
    purpose: '利用シナリオと業務手順の可視化',
    requirements: 'アクター/シナリオ/入出力/分岐/イベント',
    priority: 'Should', // ← 付け直し：Must → Should
    category: '要件定義', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-req-03', name: 'ユースケース/フロー図の作成ガイド', format: 'MD', hasSample: true,
        content: { markdown: '# 図作成ガイド', sections: ['ユースケース図', '業務フロー図'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-01', 'req-02'],
    position: { x: 520, y: 120 }
  },
  {
    id: 'req-04',
    title: '非機能要件定義書',
    description: '可用性・性能・運用・セキュリティ等のレベル合意（IPAグレード準拠）',
    purpose: 'サービス品質の合意と設計方針の基準化',
    requirements: '稼働率/RPO・RTO/レスポンス/同時接続/監視/バックアップ/法規制',
    priority: 'Must',
    category: '要件定義', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-req-04', name: '非機能要件定義書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 非機能要件定義書', sections: ['可用性', '性能', '運用', 'セキュリティ', '移行性', '制約'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-01'],
    position: { x: 720, y: 120 }
  },
  {
    id: 'req-05',
    title: '要件定義書',
    description: '対象範囲・境界・除外事項と要件の最終合意書',
    purpose: 'プロジェクトの公式な合意文書',
    requirements: '範囲/境界/除外/機能/非機能/制約/リスク',
    priority: 'Must',
    category: '要件定義',
    type: 'application',
    templates: [
      {
        id: 'tpl-req-05', name: '要件定義書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 要件定義書', sections: ['範囲', '境界', '除外事項', '機能', '非機能', '制約', 'リスク'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-01', 'req-02', 'req-03', 'req-04'],
    position: { x: 920, y: 120 }
  },
  {
    id: 'req-06',
    title: 'インフラ要件定義書',
    description: 'ネットワーク・サーバー・ストレージ等のインフラ要件',
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    priority: 'Must',
    category: '要件定義',
    type: 'infrastructure',
    templates: [
      {
        id: 'tpl-req-06', name: 'インフラ要件定義書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# インフラ要件定義書', sections: ['ネットワーク', 'サーバー', 'ストレージ', 'セキュリティ', '監視'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-04'],
    position: { x: 1120, y: 120 }
  },

  // === 基本設計（Basic Design） ===
  {
    id: 'bd-01',
    title: 'システム方式設計書',
    description: '構成方式、冗長化、ネットワーク、外部IF方式の設計',
    purpose: '非機能要件に適合する方式決定',
    requirements: '構成図/ネットワーク/冗長化/監視/外部IF一覧',
    priority: 'Must',
    category: '基本設計', // ← フェーズで統一
    type: 'infrastructure',
    templates: [
      {
        id: 'tpl-bd-01', name: 'システム方式設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# システム方式設計書', sections: ['構成図', 'ネットワーク', '冗長化', '監視', '外部IF'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-04', 'req-05'],
    position: { x: 200, y: 320 }
  },
  {
    id: 'bd-02',
    title: '画面設計書',
    description: 'UIプロトタイプ、画面遷移、入力・表示項目仕様',
    purpose: '機能設計の基礎となるUI仕様の確定',
    requirements: '画面一覧/遷移図/項目仕様/入力チェック',
    priority: 'Must',
    category: '基本設計', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-bd-02', name: '画面設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 画面設計書', sections: ['画面一覧', '遷移図', '項目仕様', '入力チェック'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-02', 'req-03'],
    position: { x: 420, y: 320 }
  },
  {
    id: 'bd-03',
    title: '帳票設計書',
    description: '帳票レイアウト・項目仕様・出力条件の設計',
    purpose: '帳票要件の実装仕様化',
    requirements: '帳票一覧/レイアウト/項目仕様/出力条件',
    priority: 'Could', // ← 付け直し：Should → Could（案件によっては不要）
    category: '基本設計', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-bd-03', name: '帳票設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 帳票設計書', sections: ['帳票一覧', 'レイアウト', '項目仕様', '出力条件'] }
      }
    ],
    isOptedIn: false,
    dependencies: ['bd-02'],
    position: { x: 640, y: 320 }
  },
  {
    id: 'bd-04',
    title: '入出力定義書',
    description: '機能/外部IFの入出力データ仕様',
    purpose: '連携・バッチ・画面I/Oの統一仕様',
    requirements: 'データ項目/型/制約/入出力条件',
    priority: 'Must',
    category: '基本設計', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-bd-04', name: '入出力定義書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 入出力定義書', sections: ['機能I/O', '外部IF', 'バッチI/O'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-02', 'bd-02'],
    position: { x: 200, y: 460 }
  },
  {
    id: 'bd-05',
    title: 'データベース論理設計書',
    description: '論理データモデル（ER）とテーブル定義',
    purpose: 'データ整合性と拡張性の担保',
    requirements: 'ER図/テーブル定義/キー/制約',
    priority: 'Must',
    category: '基本設計', // ← フェーズで統一
    type: 'application',
    templates: [
      {
        id: 'tpl-bd-05', name: '論理DB設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 論理DB設計書', sections: ['ER図', 'テーブル定義', 'キー/制約'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-02'],
    position: { x: 420, y: 460 }
  },
  {
    id: 'bd-07',
    title: '非機能設計書',
    description: 'クラスタ/フェイルオーバー、性能試算、監視・バックアップ、セキュリティ、移行/DR設計',
    purpose: '非機能要件を満たす具体的な方式を定義',
    requirements: '可用性/性能/運用/セキュリティ/移行/DR',
    priority: 'Must',
    category: '基本設計', // ← フェーズで統一
    type: 'infrastructure',
    templates: [
      {
        id: 'tpl-bd-07', name: '非機能設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# 非機能設計書', sections: ['可用性', '性能', '運用', 'セキュリティ', '移行/DR'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-04', 'bd-01'],
    position: { x: 860, y: 360 }
  },
  {
    id: 'bd-08',
    title: 'インフラ基本設計書',
    description: 'サーバー構成・ネットワーク設計・セキュリティ方式の詳細設計',
    purpose: 'インフラ要件を満たす具体的な設計',
    requirements: 'サーバー構成/ネットワーク設計/セキュリティ/監視設計',
    priority: 'Must',
    category: '基本設計',
    type: 'infrastructure',
    templates: [
      {
        id: 'tpl-bd-08', name: 'インフラ基本設計書（Markdown）', format: 'MD', hasSample: true,
        content: { markdown: '# インフラ基本設計書', sections: ['サーバー構成', 'ネットワーク設計', 'セキュリティ', '監視設計'] }
      }
    ],
    isOptedIn: true,
    dependencies: ['req-06', 'bd-01'],
    position: { x: 1060, y: 360 }
  },
]

// ⬇️ フィルタ用カテゴリ（フェーズに限定）
export const categories = [
  '要件定義',
  '基本設計',
]

// 既存のままでOK
export const deliverableTypes = [
  { value: 'application', label: 'アプリケーション成果物' },
  { value: 'infrastructure', label: 'インフラ成果物' },
]
