import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pattern, PatternInput } from "@padraosistema/lib";
import { createPattern, deletePattern, listPatterns, updatePattern } from "./patterns";

const PATTERNS_QUERY_KEY = ["patterns"];

export const usePatternsQuery = () => {
  return useQuery<Pattern[]>({
    queryKey: PATTERNS_QUERY_KEY,
    queryFn: listPatterns,
  });
};

export const useCreatePatternMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PatternInput) => createPattern(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
    },
  });
};

export const useUpdatePatternMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PatternInput }) => updatePattern(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
    },
  });
};

export const useDeletePatternMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePattern(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
    },
  });
};

