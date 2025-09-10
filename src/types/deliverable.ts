export type PriorityType = 'Must' | 'Should' | 'Could';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  purpose: string;
  requirements?: string;
  optionalRequirements?: string;
  priority: PriorityType;
  category: string;
  templates: Template[];
  checklist?: ChecklistItem[];
  isOptedIn: boolean;
  dependencies?: string[]; // 依存する成果物のID配列
  position?: { x: number; y: number }; // ダイアグラムでの位置
}

export interface Template {
  id: string;
  name: string;
  format: 'Excel' | 'MD' | 'Word' | 'PDF';
  url: string;
  hasSample: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'format' | 'content' | 'quality';
  isChecked: boolean;
}

export interface UserPreferences {
  optedInDeliverables: string[];
  hiddenCategories: string[];
}