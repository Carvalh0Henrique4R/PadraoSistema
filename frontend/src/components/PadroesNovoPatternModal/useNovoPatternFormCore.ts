import type { PatternInput } from "@padraosistema/lib";
import React from "react";
import { useForm } from "react-hook-form";
import { PATTERN_CATEGORY_SLUGS, type PatternCategorySlug } from "~/constants/patternCategories";

export type NovoPatternFormValues = PatternInput;

const defaultCategory: PatternCategorySlug = PATTERN_CATEGORY_SLUGS[0];

const defaultValues: NovoPatternFormValues = {
  title: "",
  category: defaultCategory,
  content: "",
  status: "draft",
};

type Params = {
  open: boolean;
};

export const useNovoPatternFormCore = ({
  open,
}: Params): {
  contentValue: string;
  handleSubmit: ReturnType<typeof useForm<NovoPatternFormValues>>["handleSubmit"];
  register: ReturnType<typeof useForm<NovoPatternFormValues>>["register"];
  setValue: ReturnType<typeof useForm<NovoPatternFormValues>>["setValue"];
} => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<NovoPatternFormValues>({
    defaultValues,
  });

  const contentValue = watch("content");

  React.useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  return { contentValue, handleSubmit, register, setValue };
};
