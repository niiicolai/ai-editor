import { useQuery } from '@tanstack/react-query';
import AuthTransactionService from "../services/authTransactionService";

export const useGetAuthTransaction = (_id: string) => {
    return useQuery({ queryKey: ['auth_transaction', _id], queryFn: () => AuthTransactionService.get(_id) });
}

export const useGetAuthTransactions = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['auth_transactions', page, limit, state], queryFn: () => AuthTransactionService.getAll(page, limit, state) });
}
