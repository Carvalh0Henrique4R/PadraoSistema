import { Navigate, createFileRoute } from "@tanstack/react-router";
import React from "react";

const HomeRedirect: React.FC = () => {
  return <Navigate to="/patterns" />;
};

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});
