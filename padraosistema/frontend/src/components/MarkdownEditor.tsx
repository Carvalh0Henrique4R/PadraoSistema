import MDEditor from "@uiw/react-md-editor";
import React from "react";
import { useTheme } from "~/hooks/useTheme";

type Props = {
  onBlur: (() => void) | undefined;
  onChange: (value: string) => void;
  readOnly: boolean | undefined;
  value: string;
};

export const MarkdownEditor: React.FC<Props> = ({ value, onChange, onBlur, readOnly }) => {
  const { theme } = useTheme();
  const colorMode = theme === "dark" ? "dark" : "light";

  const handleChange = React.useCallback(
    (val: string | undefined): void => {
      onChange(val ?? "");
    },
    [onChange],
  );

  if (readOnly ?? false) {
    return (
      <div className="h-full w-full" data-color-mode={colorMode}>
        <MDEditor.Markdown source={value} />
      </div>
    );
  }
  return (
    <div className="h-full w-full" data-color-mode={colorMode}>
      <MDEditor value={value} onChange={handleChange} onBlur={onBlur ?? undefined} height={400} />
    </div>
  );
};
