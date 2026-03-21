import MDEditor from "@uiw/react-md-editor";
import type { ReactNode } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export const MarkdownEditor = ({ value, onChange, onBlur }: Props): ReactNode => {
  return (
    <div data-color-mode="dark" className="w-full h-full">
      <MDEditor
        value={value}
        onChange={(val) => {
          onChange(val ?? "");
        }}
        onBlur={onBlur}
        height={400}
      />
    </div>
  );
};
