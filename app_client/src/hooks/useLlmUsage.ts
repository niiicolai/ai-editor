import { useQuery } from '@tanstack/react-query';
import LlmUsageService from "../services/llmUsageService";

export const useGetLlmUsage = (_id: string) => {
    return useQuery({ queryKey: ['llm_usage', _id], queryFn: () => LlmUsageService.get(_id) });
}

export const useGetLlmUsages = (page: number, limit: number) => {
    return useQuery({ queryKey: ['llm_usages', page, limit], queryFn: () => LlmUsageService.getAll(page, limit) });
}
