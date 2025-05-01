import { useQuery } from '@tanstack/react-query';
import AvailableLlmService from "../services/availableLlmService";

export const useGetAvailableLlm = (_id: string) => {
    return useQuery({ queryKey: ['available_llm', _id], queryFn: () => AvailableLlmService.get(_id) });
}

export const useGetAvailableLlms = (page: number, limit: number) => {
    return useQuery({ queryKey: ['available_llms', page, limit], queryFn: () => AvailableLlmService.getAll(page, limit) });
}
