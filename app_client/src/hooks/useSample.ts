import { useQuery } from '@tanstack/react-query';
import SampleService from "../services/sampleService";

export const useGetSample = (_id: string) => {
    return useQuery({ queryKey: ['sample', _id], queryFn: () => SampleService.get(_id) });
}

export const useGetSamples = (page: number, limit: number) => {
    return useQuery({ queryKey: ['samples', page, limit], queryFn: () => SampleService.getAll(page, limit) });
}
