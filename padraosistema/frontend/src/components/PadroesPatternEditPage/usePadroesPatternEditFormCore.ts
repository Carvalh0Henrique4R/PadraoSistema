import type { Pattern, PatternInput } from "@padraosistema/lib";
import { useForm } from "react-hook-form";

type FormValues = PatternInput;

export const usePadroesPatternEditFormCore = (
  pattern: Pattern,
): {
  contentValue: string;
  handleSubmit: ReturnType<typeof useForm<FormValues>>["handleSubmit"];
  register: ReturnType<typeof useForm<FormValues>>["register"];
  setValue: ReturnType<typeof useForm<FormValues>>["setValue"];
} => {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: pattern.title,
      category: pattern.category,
      content: pattern.content,
      status: pattern.status,
    },
  });

  const contentValue = watch("content");

  return { contentValue, handleSubmit, register, setValue };
};
