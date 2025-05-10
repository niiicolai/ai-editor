import { useQuery } from '@tanstack/react-query';
import AuthJobService from "../services/authJobService";

export const useGetAuthJob = (_id: string) => {
    return useQuery({ queryKey: ['auth_job', _id], queryFn: () => AuthJobService.get(_id) });
}

export const useGetAuthJobs = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['auth_jobs', page, limit, state], queryFn: () => AuthJobService.getAll(page, limit, state) });
}
