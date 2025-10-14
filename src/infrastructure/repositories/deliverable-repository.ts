import { Deliverable } from '@/domain/entities/deliverable';
import { IDeliverableRepository } from '@/domain/repositories/deliverable-repository.interface';

// 注意:
// - contentRef.key には "tpl-xxx-yy" の論理IDを入れる（manifest.json の entries[].id と一致）
// - 本文はマニフェスト経由で URL 解決して fetch する運用

const deliverables: Deliverable[] = [
  // === 要件定義（Requirements） ===
  {
    id: 'req-00',
    title: '要件定義書',
    description: '要件定義で行った全ての工程は、この要件定義書に統合される。',
    purpose: '顧客と開発側の合意の証。契約・品質・スコープを規定する。',
    requirements: '目的/KPI/アクター/トリガー/前提条件/アウトカム',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'tpl-req-00',
        name: '業務要件一覧書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-01', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: true,
    isOptedIn: true,
  },
  {
    id: 'req-01',
    title: '業務一覧',
    description: 'システムに関連する業務を洗い出し、一覧にして、システム化対象か対象外か明記する。',
    purpose: '•ステークホルダー間で「業務」に対する認識齟齬を防ぎ、合意形成を支援する• システム化対象業務と対象外業務を識別し、スコープを明確にする• トレーサビリティ（業務 → 機能 → 非機能要件、さらにはテスト仕様等）の出発点となる',
    requirements: '目的/KPI/アクター/トリガー/前提条件/アウトカム',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-01',
        name: '業務要件一覧書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-01', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "対象/非対象や範囲が曖昧となり合意形成とスコープ管理が破綻して、トレーサビリティ起点も失われる。"
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-02',
    title: '制約条件一覧',
    description: '業務やシステムを設計・運用する上で守らなければならない条件や制約を明確に整理する。',
    purpose: '機能スコープの明確化と優先順位付け',
    requirements: '機能ID/名称/説明/入出力/優先度',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-02',
        name: '機能要件一覧書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-02', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "'設計・改善の判断基準が不明確なまま進行し、実現不能なTo-Beや見積崩れ・大幅な手戻りを招く。'"
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-03',
    title: '業務フロー一覧',
    description: '対象業務のAsIs業務フローとToBe業務フローを一覧に整理する。',
    purpose: '利用シナリオと業務手順の可視化',
    requirements: 'アクター/シナリオ/入出力/分岐/イベント',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-03',
        name: 'ユースケース/フロー図の作成ガイド',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-03', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-03.1',
    title: 'AsIs業務フロー',
    description: '対象業務のAsIs業務フローとToBe業務フローを一覧に整理する。',
    purpose: '利用シナリオと業務手順の可視化',
    requirements: 'アクター/シナリオ/入出力/分岐/イベント',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-03',
        name: 'ユースケース/フロー図の作成ガイド',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-03', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "現行業務の流れと課題が共有されず、ToBe検討の土台が欠落して改善効果が出ない設計に陥る。"
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-03.2',
    title: 'ToBe業務フロー',
    description: '対象業務のAsIs業務フローとToBe業務フローを一覧に整理する。',
    purpose: '利用シナリオと業務手順の可視化',
    requirements: 'アクター/シナリオ/入出力/分岐/イベント',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-03',
        name: 'ユースケース/フロー図の作成ガイド',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-03', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "将来の業務像と責任分担・情報連携が定義されず、要件の根拠が曖昧で合意も取れず運用テストにも落とし込めない。"

    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-04',
    title: 'データ定義',
    description: '業務で扱う情報（データ）を統一的に整理し、属性・型・意味・利用ルールを定義する。',
    purpose: 'プロジェクトの公式な合意文書',
    requirements: '範囲/境界/除外/機能/非機能/制約/リスク',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-05',
        name: '要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-05', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: 'データ項目の意味・構造の共通認識がなく、設計やDB定義の基礎が揺らいで連携不整合や移行不具合が増える。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-05',
    title: '業務ルール一覧',
    description: 'ToBe業務フローで定義した手順・役割を具体的に運用可能にするために、「どのような条件・基準・判断ルールで業務が実行されるか」を明確化する。',
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-06',
        name: 'インフラ要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-06', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: 'フロー図で表現し切れない判断条件が口伝に留まり運用が再現性を欠き、システム要件の根拠も弱体化する。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-06',
    title: '用語集',
    description: '業務・システム関連の用語を定義し、ステークホルダー間で共通理解を形成する。',
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-06',
        name: 'インフラ要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-06', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '共通言語が確立されず解釈のばらつきが恒常化し、要件・設計・テストの議論が空回りして差し戻しが増える。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-07',
    title: '機能要件一覧',
    description: `業務要件を実現するために、システムが提供すべき機能を明確化し、業務とシステムの責任分界を定義するプロセス。
「何をシステムで行うのか」「どのように業務を支援するのか」を明確にする。`,
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'tpl-req-06',
        name: 'インフラ要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-06', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '必要機能の範囲・粒度・優先度が不明確で、認識齟齬と過不足実装が発生し基本設計や見積の根拠が崩れる。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-08',
    title: '非機能要件定義',
    description: 'システムが備えるべき性能・信頼性・可用性・セキュリティなど、機能以外の品質要求を明確化する。',
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'tpl-req-06',
        name: 'インフラ要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-06', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '品質水準と指針・受入基準の根拠が欠落し、性能や可用性・セキュリティに関する合意が得られず品質保証が困難になる。'

    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'req-09',
    title: 'サービス構成図',
    description: 'システムやサービスの構成要素（アクター、サーバ、アプリケーション、DB、ネットワーク、外部サービスなど）を視覚的に表現する。',
    purpose: 'システム基盤の要件明確化',
    requirements: 'ネットワーク/サーバー/ストレージ/セキュリティ/監視',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'tpl-req-06',
        name: 'インフラ要件定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-req-06', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '全体構成と接続関係が可視化されず設計・運用の指針が曖昧で、関係者の認識が合わず障害時の影響把握も遅れる。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },

  // === 基本設計（Basic Design） ===
  {
    id: 'bd-01',
    title: 'システム方式設計書',
    description: '構成方式、冗長化、ネットワーク、外部IF方式の設計',
    purpose: '非機能要件に適合する方式決定',
    requirements: '構成図/ネットワーク/冗長化/監視/外部IF一覧',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-01',
        name: 'システム方式設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-01', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'bd-02',
    title: '画面設計書',
    description: 'UIプロトタイプ、画面遷移、入力・表示項目仕様',
    purpose: '機能設計の基礎となるUI仕様の確定',
    requirements: '画面一覧/遷移図/項目仕様/入力チェック',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-02',
        name: '画面設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-02', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'bd-03',
    title: '帳票設計書',
    description: '帳票レイアウト・項目仕様・出力条件の設計',
    purpose: '帳票要件の実装仕様化',
    requirements: '帳票一覧/レイアウト/項目仕様/出力条件',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-03',
        name: '帳票設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-03', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: false,
  },
  {
    id: 'bd-04',
    title: '入出力定義書',
    description: '機能/外部IFの入出力データ仕様',
    purpose: '連携・バッチ・画面I/Oの統一仕様',
    requirements: 'データ項目/型/制約/入出力条件',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-04',
        name: '入出力定義書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-04', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'bd-05',
    title: 'データベース論理設計書',
    description: '論理データモデル（ER）とテーブル定義',
    purpose: 'データ整合性と拡張性の担保',
    requirements: 'ER図/テーブル定義/キー/制約',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-05',
        name: '論理DB設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-05', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'bd-07',
    title: '非機能設計書',
    description: 'クラスタ/フェイルオーバー、性能試算、監視・バックアップ、セキュリティ、移行/DR設計',
    purpose: '非機能要件を満たす具体的な方式を定義',
    requirements: '可用性/性能/運用/セキュリティ/移行/DR',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-07',
        name: '非機能設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-07', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'bd-08',
    title: 'インフラ基本設計書',
    description: 'サーバー構成・ネットワーク設計・セキュリティ方式の詳細設計',
    purpose: 'インフラ要件を満たす具体的な設計',
    requirements: 'サーバー構成/ネットワーク設計/セキュリティ/監視設計',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-08',
        name: 'インフラ基本設計書（Markdown）',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'tpl-bd-08', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  }
];

const categories: string[] = [
  '要件定義',
  '基本設計'
];

const deliverableTypes: Array<{ value: string; label: string }> = [
  { value: 'application', label: 'アプリケーション成果物' },
  { value: 'infrastructure', label: 'インフラ成果物' }
];

// ===== Module (arrow functions) =====

export const getAll: IDeliverableRepository['getAll'] = (): Deliverable[] => deliverables;

export const getById: IDeliverableRepository['getById'] = (id: string): Deliverable | undefined =>
  deliverables.find(d => d.id === id);

export const getByCategory: IDeliverableRepository['getByCategory'] = (category: string): Deliverable[] =>
  deliverables.filter(d => d.category === category);

export const getCategories: IDeliverableRepository['getCategories'] = (): string[] => categories;

export const getDeliverableTypes: IDeliverableRepository['getDeliverableTypes'] =
  (): Array<{ value: string; label: string }> => deliverableTypes;

// 互換エクスポート（旧コードが import していても動くように残す）
export const deliverableRepository: IDeliverableRepository = {
  getAll,
  getById,
  getByCategory,
  getCategories,
  getDeliverableTypes
};
