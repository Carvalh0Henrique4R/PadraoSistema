import { Navigate, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PadroesPatternEditPage } from "~/components/PadroesPatternEditPage/PadroesPatternEditPage";
import { PadroesPatternListPage } from "~/components/PadroesPatternListPage/PadroesPatternListPage";
import { isPatternCategorySlug, isUuidSegment } from "~/constants/patternCategories";

const PatternsSegmentPage: React.FC = () => {
  const { segment } = Route.useParams();

  if (isUuidSegment(segment)) {
    return <PadroesPatternEditPage patternId={segment} />;
  }

  if (isPatternCategorySlug(segment)) {
    return <PadroesPatternListPage categorySlug={segment} />;
  }

  return <Navigate to="/patterns" />;
};

export const Route = createFileRoute("/patterns/$segment")({
  component: PatternsSegmentPage,
});
