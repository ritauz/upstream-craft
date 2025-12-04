import { Deliverable } from '@/domain/entities/deliverable';
import { IDeliverableRepository } from '@/domain/repositories/deliverable-repository.interface';

// - 本文はマニフェスト経由で URL 解決して fetch する運用

const deliverables: Deliverable[] = [
  // === 要件定義（Requirements） ===
  {
    id: 'req-spec',
    title: '要件定義書',
    description: '要件定義で行った全てのプロセスの成果物は、この要件定義書に統合される。',
    purpose: 'プロジェクトの目的を達成するための最適解であることを保証する。後工程である設計・開発・テストの指針、達成目標となる。プロジェクトマネジメントにおけるスコープ基準（ベースライン）。',
    // activity: [],
    guideLink: 'https://www.notion.so/289e8bc3d80d80058f72e097a45abde1',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'req-spec',
        name: '要件定義書',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'req-spec', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: true,
    isOptedIn: true,
  },
  {
    id: 'stakeholder-register',
    title: 'ステークホルダー登録簿',
    description: '要件定義にどのような人物たちが関わっており、どのような役割と影響力をもっているのかを整理する。',
    purpose: '要件定義に関わる「誰が、どの立場で、何に関心を持ち、どんな責任を持つか」を明確にし、合意形成を円滑に進めること',
    activity: [
      'プロジェクト文書やヒアリングなどからステークホルダーを洗い出す',
      'ステークホルダーの識別情報を取得し、特定してリストアップする',
      'ステークホルダーの関心や影響度を評価する',
      'コミュニケーション計画を立てるために、ステークホルダーを分類する',
    ],
    guideLink: '',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'stakeholder-register',
        name: 'ステークホルダー登録簿',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'stakeholder-register', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "必要な要望が拾えない、誰が承認するか権限と責任の所在が不明になるなど、円滑な合意形成に支障をきたす。",
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'stakeholder-map',
    title: 'ステークホルダー関連図',
    description: 'ステークホルダー間の関係・影響・情報の流れを視覚化した図。',
    purpose: 'ステークホルダー間の影響関係・情報経路を把握し、合意形成の優先順位付けを支援する。',
    activity: [
      'ステークホルダー登録簿をもとに関係を整理する',
      '関係の種類や強さを定義する',
      '矢印・線種・色のルールを統一する',
      '関係者全員で図を確認し、「抜け・誤り」を修正する',
    ],
    guideLink: '',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'stakeholder-map',
        name: 'ステークホルダー関連図',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'stakeholder-map', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "意思決定経路の不明確化、利害関係の対立未把握によって、合意形成や要件確定が遅延する。",
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'biz-issue-list',
    title: '業務課題一覧',
    description: '現行業務（AsIs）の中で、効率低下などの問題の原因となっている「課題」を整理した一覧。',
    purpose: 'システム化や業務改善の出発点となる。',
    // activity: [],
    guideLink: '',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'biz-issue-list',
        name: '業務課題一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'biz-issue-list', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "要件が表面的な改善にとどまり、本質的な課題を解決できず、システム導入後に不満が出る。",
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'stakeholder-needs',
    title: '要望一覧',
    description: 'ステークホルダーが抱く漠然とした期待や希望を整理した一覧。',
    purpose: '合意形成すべき要求の全体像を把握する。要件抽出と優先度決定の基礎とする。',
    // activity: [],
    guideLink: '',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'stakeholder-needs',
        name: '要望一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'stakeholder-needs', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "対象/非対象や範囲が曖昧となり合意形成とスコープ管理が破綻して、トレーサビリティ起点も失われる。",
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'constraints',
    title: '制約条件一覧',
    description: '業務やシステムを設計・運用する上で守らなければならない条件や制約を明確に整理する。',
    purpose: '機能スコープの明確化と優先順位付け',
    activity: ['納期・予算・法令・規程・社内規則・契約・リソース制約・システム制約などを収集する', '収集した制約を業務別・システム別・リスク影響別などで分類し一覧化する', '関係部門のレビューで、内容に間違いがないことを確認する'],
    guideLink: 'https://www.notion.so/283e8bc3d80d80e5bdb4eb93bb130453',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'constraints',
        name: '制約条件一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'constraints', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: "設計・改善の判断基準が不明確なまま進行し、実現不能なTo-Beや見積崩れ・大幅な手戻りを招く。"
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'biz-list',
    title: '業務一覧',
    description: 'システムに関連する業務を洗い出し、一覧にして、システム化対象か対象外か明記する。',
    purpose: 'システム化対象業務と対象外業務を識別し、スコープを明確にする',
    activity: ['関連業務の洗い出し', ' 識別のための業務名称と、その範囲の明文化', 'システム化対象内/対象外の識別と合意'],
    guideLink: 'https://www.notion.so/27ae8bc3d80d80a8af59c50cf8937050',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'biz-list',
        name: '業務一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'biz-list', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: 'ステークホルダー間で業務範囲の認識がずれ、システム化対象と非対象の区別が曖昧になり、スコープ誤認や要件漏れが発生して後工程で大きな手戻りを招く。',
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'biz-flow-list',
    title: 'AsIs/ToBe 業務フロー',
    description: '対象業務のAsIs業務フローとToBe業務フローを一覧に整理する。',
    purpose: '利用シナリオと業務手順の可視化',
    activity: ['現行業務のヒアリング・ドキュメント収集・現場観察などで情報収集', '実際の業務手順、入力・出力、担当者、システムを整理してフロー図作成', 'フロー中のボトルネック、属人化、重複業務などの原因事象を洗い出し、課題定義する', ' AsIs分析結果から、課題・制約・非効率箇所を抽出し、改善すべきテーマを特定する', ' 新しい業務手順、役割分担、システム活用方法を設計し、ToBeフローとして可視化する', '関係部門との妥当性レビューや合意形成、実現性評価を行う'],
    guideLink: 'https://www.notion.so/AsIs-283e8bc3d80d802ca0f2c10e842a69ee',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'biz-flow-list',
        name: 'AsIs/ToBe 業務フロー',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'biz-flow-list', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '現行業務と将来業務の流れや責任分担が整理されず、課題や改善方向が不明確なまま要件定義が進行し、業務改善効果が得られないシステム設計となる。',
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'biz-flow-diagram',
    title: '業務フロー図',
    description: '業務フローを可視化する。',
    purpose: '利用シナリオと業務手順の可視化',
    // activity: [],
    guideLink: 'https://www.notion.so/ToBe-283e8bc3d80d80b2844dc6d6ee98d67a',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'biz-flow-diagram',
        name: 'ユースケース/フロー図の作成ガイド',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'biz-flow-diagram', version: 'current' },
        updatedAt: undefined
      }
    ],
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'data-def',
    title: 'データ定義書',
    description: '業務で扱う情報（データ）を統一的に整理し、属性・型・意味・利用ルールを定義する。',
    purpose: '業務で使用するデータ項目の意味や構造の共通認識を形成する',
    activity: ['ToBe の業務から、システムで扱うべきデータを洗い出す', 'データ名、型、桁数、単位、必須/任意、制約、参照関係などを整理し、定義する', '関係部門とレビューし、業務・システム双方で使用可能な正式な定義として確定する'],
    guideLink: 'https://www.notion.so/283e8bc3d80d80f5bf12c9b07d48ca64',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'data-def',
        name: 'データ定義書',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'data-def', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: 'データ項目の意味・構造の共通認識がなく、設計やDB定義の基礎が揺らいで連携不整合や移行不具合が増える。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'biz-rules',
    title: '業務ルール一覧',
    description: 'ToBe業務フローで定義した手順・役割を具体的に運用可能にするために、「どのような条件・基準・判断ルールで業務が実行されるか」を明確化する。',
    purpose: 'システム基盤の要件明確化',
    guideLink: 'https://www.notion.so/283e8bc3d80d8079864ae6fc8da105f4',
    activity: ['フロー図では表現しきれない業務の判断・条件分岐・例外対応などを洗い出す', ' 各ルールを「条件」「処理内容」「責任者」「根拠」「例外対応」などとして定義', '関係部門との妥当性レビューや合意形成、実現性評価を行う'],
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'biz-rules',
        name: '業務ルール一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'biz-rules', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: 'フロー図で表現し切れない判断条件が口伝に留まり運用が再現性を欠き、システム要件の根拠も弱体化する。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'glossary',
    title: '用語集',
    description: '業務・システム関連の用語を定義し、ステークホルダー間で共通理解を形成する。',
    purpose: 'システム基盤の要件明確化',
    activity: ['ドキュメント（業務フロー、要件一覧、データ定義書など）や会話から主要用語を抽出', '各用語の意味、用途、関連語、区別点を明確に定義する'],
    guideLink: 'https://www.notion.so/283e8bc3d80d8080abbefaab84e9ea4b',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'glossary',
        name: '用語集',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'glossary', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '共通言語が確立されず解釈のばらつきが恒常化し、要件・設計・テストの議論が空回りして差し戻しが増える。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'func-req-list',
    title: '機能要件一覧',
    description: `業務要件を実現するために、システムが提供すべき機能を明確化し、業務とシステムの責任分界を定義するプロセス。
「何をシステムで行うのか」「どのように業務を支援するのか」を明確にする。`,
    purpose: '業務要件を実現するために必要なシステム機能を明示する。',
    activity: ['業務要件と業務ルールの分析', '業務プロセスとの機能対応付け', '機能一覧の作成', '機能階層構造（ツリー）および概要定義', '非機能要件との整合確認'],
    guideLink: 'https://www.notion.so/283e8bc3d80d802faa98d5af59091028',
    category: '要件定義',
    type: ['application'],
    templates: [
      {
        id: 'func-req-list',
        name: '機能要件一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'func-req-list', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '必要機能の範囲・粒度・優先度が不明確で、認識齟齬と過不足実装が発生し基本設計や見積の根拠が崩れる。'
    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'non-func-req-list',
    title: '非機能要件定義',
    description: 'システムが備えるべき性能・信頼性・可用性・セキュリティなど、機能以外の品質要求を明確化する。',
    purpose: 'システム全体の品質水準を定義する',
    activity: ['非機能要件項目の洗い出し関連する', '制約条件・業務条件との整合確認', '測定可能な基準値の設定（例：レスポンスタイム、可用性率）', '優先度や重要度の整理', 'レビューと承認による合意形成'],
    guideLink: 'https://www.notion.so/283e8bc3d80d80889936c6836cc2ba22',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'non-func-req-list',
        name: '非機能要件一覧',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'non-func-req-list', version: 'current' },
        updatedAt: undefined
      }
    ],
    risks: '品質水準と指針・受入基準の根拠が欠落し、性能や可用性・セキュリティに関する合意が得られず品質保証が困難になる。'

    ,
    isPhazeDlv: false,
    isOptedIn: true,
  },
  {
    id: 'service-comp',
    title: 'サービス構成図',
    description: 'システムやサービスの構成要素（アクター、サーバ、アプリケーション、DB、ネットワーク、外部サービスなど）を視覚的に表現する。',
    purpose: 'ステークホルダー間の共通認識と合意形成',
    activity: ['サービス／システム構成要素の洗い出し', '接続・依存関係の整理図面化（視覚化）'],
    guideLink: 'https://www.notion.so/284e8bc3d80d803b9d98e0302409111f',
    category: '要件定義',
    type: ['application', 'infrastructure'],
    templates: [
      {
        id: 'service-comp',
        name: 'インフラ要件定義書',
        format: 'MD',
        hasSample: true,
        contentRef: { provider: 'blob', key: 'service-comp', version: 'current' },
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-01',
        name: 'システム方式設計書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-02',
        name: '画面設計書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-03',
        name: '帳票設計書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-04',
        name: '入出力定義書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['application'],
    templates: [
      {
        id: 'tpl-bd-05',
        name: '論理DB設計書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-07',
        name: '非機能設計書',
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
    activity: [],
    guideLink: '',
    category: '基本設計',
    type: ['infrastructure'],
    templates: [
      {
        id: 'tpl-bd-08',
        name: 'インフラ基本設計書',
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
