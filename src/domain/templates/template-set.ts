export type TemplateFrontMatter = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  [key: string]: unknown;
};

export type TemplateDoc = {
  id: string;
  frontMatter: TemplateFrontMatter;
  body: string;
  updatedAt: string;
};

export type TemplateSetVersion = {
  standardMajor: number;
  standardVersion: string;
  generatedAt: string;
  templates: TemplateDoc[];
};
