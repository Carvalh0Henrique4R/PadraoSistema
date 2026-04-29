import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { PadroesPatternListPage } from "~/components/PadroesPatternListPage/PadroesPatternListPage";

const PatternsIndexPage: React.FC = () => {
  return <PadroesPatternListPage categorySlug={null} />;
};

export const Route = createFileRoute("/patterns/")({
  component: PatternsIndexPage,
});
