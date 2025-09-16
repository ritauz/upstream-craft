export type PriorityType = 'Must' | 'Should' | 'Could';
export type DeliverableType = 'application' | 'infrastructure';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  purpose: string;
  requirements?: string;
  optionalRequirements?: string;
  priority: PriorityType;
  category: string;
  type: DeliverableType; // アプリケーション成果物かインフラ成果物か
  templates: Template[];
  checklist?: ChecklistItem[];
  isOptedIn: boolean;
  dependencies?: string[]; // 依存する成果物のID配列
  position?: { x: number; y: number }; // ダイアグラムでの位置
  risks?: DeliverableRisk[]; // 成果物選択時のリスク
}

export interface Template {
  id: string;
  name: string;
  format: 'Excel' | 'MD' | 'Word' | 'PDF';
  url: string;
  hasSample: boolean;
  content?: TemplateContent; // MDテンプレートの場合のコンテンツ
  sections?: TemplateSection[]; // カスタマイズ可能なセクション
}

export interface TemplateContent {
  markdown: string;
  sections: string[]; // セクション名のリスト
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  content: string;
  isSelected: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'format' | 'content' | 'quality';
  isChecked: boolean;
}

export interface DeliverableRisk {
  id: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  mitigation?: string;
}

export interface UserPreferences {
  optedInDeliverables: string[];
  hiddenCategories: string[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  risks: DeliverableRisk[];
  recommendations: string[];
}