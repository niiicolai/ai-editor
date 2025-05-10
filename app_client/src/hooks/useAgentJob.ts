import { useQuery } from '@tanstack/react-query';
import AgentJobService from "../services/agentJobService";

export const useGetAgentJob = (_id: string) => {
    return useQuery({ queryKey: ['agent_job', _id], queryFn: () => AgentJobService.get(_id) });
}

export const useGetAgentJobs = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['agent_jobs', page, limit, state], queryFn: () => AgentJobService.getAll(page, limit, state) });
}
