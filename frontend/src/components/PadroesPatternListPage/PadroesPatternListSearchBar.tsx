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
        className={`flex items-center gap-3 rounded-lg border border-input bg-background shadow-xs transition-colors duration-150 hover:border-ring/35 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 ${innerPadding}`}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
        <input
          id="busca-padroes"
          type="search"
          placeholder="Buscar padrões..."
          value={value}
          onChange={handleChange}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
};
