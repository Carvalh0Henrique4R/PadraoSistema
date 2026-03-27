import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  raise,
  SYSTEM_MESSAGE_CREATED,
  SYSTEM_MESSAGE_DELETED,
  SYSTEM_MESSAGE_UPDATED,
  type Pattern,
  type PatternInput,
  type PatternVersionDetail,
  type PatternVersionListItem,
} from "@padraosistema/lib";
import { useFlashMessage } from "~/context/FlashMessageContext";
import {
  createPattern,
  deletePattern,
  getPattern,
  getPatternVersion,
  listPatterns,
  listPatternVersions,
  updatePattern,
} from "./patterns";

const PATTERNS_QUERY_KEY = ["patterns"];

const patternVersionsKey = (patternId: string): [string, string, string, string] => [
  "patterns",
  patternId,
  "versions",
  "list",
];

const patternVersionDetailKey = (
  patternId: string,
  version: number,
): [string, string, string, string, number] => ["patterns", patternId, "versions", "detail", version];

export const usePatternsQuery = (): UseQueryResult<Pattern[]> => {
  return useQuery<Pattern[]>({
    queryKey: PATTERNS_QUERY_KEY,
    queryFn: listPatterns,
  });
};

export const usePatternQuery = (id: string): UseQueryResult<Pattern> => {
  return useQuery<Pattern>({
    queryKey: [...PATTERNS_QUERY_KEY, id],
    queryFn: () => getPattern(id),
  });
};

export const useCreatePatternMutation = (): UseMutationResult<Pattern, Error, PatternInput> => {
  const queryClient = useQueryClient();
  const { showSuccess } = useFlashMessage();
  return useMutation({
    mutationFn: (input: PatternInput) => createPattern(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
      showSuccess(SYSTEM_MESSAGE_CREATED);
    },
  });
};

export const useUpdatePatternMutation = (): UseMutationResult<Pattern, Error, { id: string; input: PatternInput }> => {
  const queryClient = useQueryClient();
  const { showSuccess } = useFlashMessage();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PatternInput }) => updatePattern(id, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: [...PATTERNS_QUERY_KEY, variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["patterns", variables.id, "versions"] });
      showSuccess(SYSTEM_MESSAGE_UPDATED);
    },
  });
};

export const usePatternVersionsQuery = (
  patternId: string,
  enabled: boolean,
): UseQueryResult<PatternVersionListItem[]> => {
  return useQuery<PatternVersionListItem[]>({
    enabled,
    queryFn: () => listPatternVersions(patternId),
    queryKey: patternVersionsKey(patternId),
  });
};

export type UsePatternVersionQueryParams = {
  enabled: boolean;
  patternId: string;
  version: number | undefined;
};

export const usePatternVersionQuery = (params: UsePatternVersionQueryParams): UseQueryResult<PatternVersionDetail> => {
  const version = params.version;
  const canFetch = params.enabled && version != null && version > 0;
  const queryKey =
    version != null && version > 0
      ? patternVersionDetailKey(params.patternId, version)
      : (["patterns", params.patternId, "versions", "detail", "idle"] as const);
  return useQuery<PatternVersionDetail>({
    enabled: canFetch,
    queryFn: () => getPatternVersion(params.patternId, version ?? raise("Pattern version query disabled")),
    queryKey,
  });
};

export const useDeletePatternMutation = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  const { showSuccess } = useFlashMessage();
  return useMutation({
    mutationFn: (id: string) => deletePattern(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: PATTERNS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: [...PATTERNS_QUERY_KEY, id] });
      showSuccess(SYSTEM_MESSAGE_DELETED);
    },
  });
};
