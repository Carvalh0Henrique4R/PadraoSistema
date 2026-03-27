import { Link } from "@tanstack/react-router";
import React from "react";
import { usePatternQuery } from "~/api/patterns.hooks";
import { useSession } from "~/hooks/useSession";
import { PadroesPatternEditForm } from "./PadroesPatternEditForm";

type Props = {
  patternId: string;
};

export const PadroesPatternEditPage: React.FC<Props> = ({ patternId }) => {
  const { data: pattern, isLoading, isError } = usePatternQuery(patternId);
  const { data: session } = useSession();

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center p-6 text-slate-400">Carregando padrão...</div>;
  }

  if (isError || pattern == null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-400">Padrão não encontrado.</p>
        <Link to="/patterns" className="text-sm text-indigo-400 hover:text-indigo-300">
          Voltar à lista
        </Link>
      </div>
    );
  }

  const canEdit = session != null && session.user.id === pattern.userId;

  return <PadroesPatternEditForm canEdit={canEdit} pattern={pattern} />;
};
