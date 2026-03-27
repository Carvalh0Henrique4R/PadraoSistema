import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { PadroesNovoPatternModal } from "~/components/PadroesNovoPatternModal/PadroesNovoPatternModal";

const NewPatternPage: React.FC = () => {
  const navigate = useNavigate();
  const handleClose = (): void => {
    void navigate({ to: "/patterns" });
  };
  return <PadroesNovoPatternModal open onClose={handleClose} />;
};

export const Route = createFileRoute("/patterns/new")({
  component: NewPatternPage,
});
