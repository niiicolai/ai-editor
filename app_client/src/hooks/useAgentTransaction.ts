import { useQuery } from '@tanstack/react-query';
import AgentTransactionService from "../services/agentTransactionService";

export const useGetAgentTransaction = (_id: string) => {
    return useQuery({ queryKey: ['agent_transaction', _id], queryFn: () => AgentTransactionService.get(_id) });
}

export const useGetAgentTransactions = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['agent_transactions', page, limit, state], queryFn: () => AgentTransactionService.getAll(page, limit, state) });
}
