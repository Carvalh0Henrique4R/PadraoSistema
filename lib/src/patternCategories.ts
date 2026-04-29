export const PATTERN_CATEGORY_SLUGS = ["componentes", "layouts", "comportamentos", "apis", "dados"] as const;

export type PatternCategorySlug = (typeof PATTERN_CATEGORY_SLUGS)[number];

export const PATTERN_CATEGORY_LABELS: Record<PatternCategorySlug, string> = {
  apis: "APIs",
  componentes: "Componentes",
  comportamentos: "Comportamentos",
  dados: "Dados",
  layouts: "Layouts",
};

export const isPatternCategorySlug = (value: string): value is PatternCategorySlug => {
  return PATTERN_CATEGORY_SLUGS.some((slug) => slug === value);
};

const uuidSegmentRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuidSegment = (value: string): boolean => {
  return uuidSegmentRe.test(value);
};
