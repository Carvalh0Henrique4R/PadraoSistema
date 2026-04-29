import type { Pattern, PatternInput } from "@padraosistema/lib";
import React from "react";
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
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: pattern.title,
      category: pattern.category,
      content: pattern.content,
      status: pattern.status,
    },
  });

  React.useEffect(() => {
    reset({
      title: pattern.title,
      category: pattern.category,
      content: pattern.content,
      status: pattern.status,
    });
  }, [pattern.category, pattern.content, pattern.id, pattern.status, pattern.title, pattern.version, reset]);

  const contentValue = watch("content");

  return { contentValue, handleSubmit, register, setValue };
};
