import React from "react";

type Props = {
  label: string;
};

export const PadroesPatternsLoadingView: React.FC<Props> = ({ label }) => {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-950 text-slate-300">
      {label}
    </div>
  );
};
