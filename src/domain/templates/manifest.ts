export type TemplateEntry = {
  id: string;
  key: string;
  url?: string;
  updatedAt: string;
};

export type TemplateManifest = {
  standardMajor: number;
  standardVersion: string;
  generatedAt: string;
  templates: TemplateEntry[];
};

export type LegacyRevisionEntry = {
  revision: string;
  key: string;
  url?: string;
  updatedAt: string;
};

export type LegacyManifestEntry = {
  id: string;
  latestRevision: string;
  revisions: LegacyRevisionEntry[];
};

export type LegacyManifest = {
  generatedAt: string;
  entries: LegacyManifestEntry[];
};

export const parseStandardMajor = (value: string | undefined, fallback = 1): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const parseStandardVersion = (value: string | undefined, fallback = '1.0'): string => {
  return value?.trim() || fallback;
};

export const isLegacyManifest = (data: unknown): data is LegacyManifest => {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as LegacyManifest;
  return Array.isArray(candidate.entries);
};

export const convertLegacyManifest = (
  legacy: LegacyManifest,
  standardMajor: number,
  standardVersion: string,
): TemplateManifest => {
  const templates = legacy.entries.map(entry => {
    const latest = entry.revisions.find(r => r.revision === entry.latestRevision) ??
      entry.revisions[entry.revisions.length - 1];
    if (!latest) {
      throw new Error(`legacy manifest entry has no revisions: ${entry.id}`);
    }
    return {
      id: entry.id,
      key: latest.key,
      url: latest.url,
      updatedAt: latest.updatedAt,
    } satisfies TemplateEntry;
  });

  return {
    standardMajor,
    standardVersion,
    generatedAt: legacy.generatedAt,
    templates,
  };
};
