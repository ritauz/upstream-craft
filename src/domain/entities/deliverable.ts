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
  type: DeliverableType;
  templates: Template[];
  checklist?: ChecklistItem[];
  isOptedIn: boolean;
  dependencies?: string[];
  position?: { x: number; y: number };
  risks?: DeliverableRisk[];
}

export interface Template {
  id: string;
  name: string;
  format: 'Excel' | 'MD' | 'Word' | 'PDF';
  hasSample: boolean;
  content?: TemplateContent;
  sections?: TemplateSection[];
}

export interface TemplateContent {
  markdown: string;
  sections: string[];
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
