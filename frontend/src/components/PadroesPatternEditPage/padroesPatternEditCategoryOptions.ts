import { PATTERN_CATEGORY_SLUGS } from "~/constants/patternCategories";

export const buildPatternEditCategoryOptions = (category: string): string[] => {
  const extra = PATTERN_CATEGORY_SLUGS.some((slug) => slug === category) ? [] : [category];
  return [...PATTERN_CATEGORY_SLUGS, ...extra];
};
