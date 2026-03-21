import React from "react";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export const PadroesPatternListSearchBar: React.FC<Props> = ({ value, onValueChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onValueChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2 px-6 pt-6">
      <label htmlFor="busca-padroes" className="sr-only">
        Buscar padrões
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3">
        <span className="text-slate-500" aria-hidden>
          🔍
        </span>
        <input
          id="busca-padroes"
          type="search"
          placeholder="Buscar padrões..."
          value={value}
          onChange={handleChange}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>
    </div>
  );
};
