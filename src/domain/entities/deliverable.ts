export type DeliverableType = 'application' | 'infrastructure';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  purpose: string;
  activity?: string[];
  optionalRequirements?: string;
  category: string;
  type: DeliverableType[];
  templates: TemplateRef[];
  isPhazeDlv: boolean;
  isOptedIn: boolean;
  risks?: string;
  guideLink?: string;
}

export type TemplateFormat = 'MD' | 'MDX';

export interface TemplateRef {
  id: string;        // 例: 'tpl-req-01' （= ファイル名ベース）
  name: string;      // 表示名
  format: TemplateFormat;
  hasSample: boolean;
  contentRef: {
    provider: 'blob' | 'signed-url';
    key: string;           // マニフェスト上の key（内容ハッシュ付き）
    version?: string;      // 任意（表示用）
  };
  updatedAt?: string;
}

export interface TemplateContent {
  markdown: string;
  sections: string[];
}

export interface Template {
  id: string;
  name: string;
  format: TemplateFormat;
  sections?: TemplateSection[];
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  content: string;
  isSelected: boolean;
}

export interface DeliverableRisk {
  id: string;
  description: string;
  impact: string;
  mitigation?: string;
}

export interface UserPreferences {
  optedInDeliverables: string[];
  hiddenCategories: string[];
}

export interface RiskAssessment {
  risks: DeliverableRisk[];
  recommendations: string[];
}
