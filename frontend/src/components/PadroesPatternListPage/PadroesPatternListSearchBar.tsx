import { Search } from "lucide-react";
import React from "react";

type Props = {
  layout?: "header" | "page" | "subheader";
  value: string;
  onValueChange: (value: string) => void;
};

export const PadroesPatternListSearchBar: React.FC<Props> = ({ layout = "page", value, onValueChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onValueChange(event.target.value);
  };

  const isToolbar = layout === "header" || layout === "subheader";
  const outerClass = isToolbar ? "flex min-w-0 w-full flex-1 flex-col gap-0" : "flex flex-col gap-2 px-6 pt-6";
  const innerPadding = isToolbar ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className={outerClass}>
      <label htmlFor="busca-padroes" className="sr-only">
        Buscar padrões
      </label>
      <div
        className={`flex items-center gap-3 rounded-md border border-[#dfe6e3] bg-white transition-colors duration-150 hover:border-[#c9d4d0] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 ${innerPadding}`}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0 text-[#52615d] dark:text-slate-400" strokeWidth={2} />
        <input
          id="busca-padroes"
          type="search"
          placeholder="Buscar padrões..."
          value={value}
          onChange={handleChange}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#22302d] outline-none placeholder:text-[#7b8985] dark:text-white"
        />
      </div>
    </div>
  );
};
