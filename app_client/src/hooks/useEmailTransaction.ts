import { useQuery } from '@tanstack/react-query';
import EmailTransactionService from "../services/emailTransactionService";

export const useGetEmailTransaction = (_id: string) => {
    return useQuery({ queryKey: ['email_transaction', _id], queryFn: () => EmailTransactionService.get(_id) });
}

export const useGetEmailTransactions = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['email_transactions', page, limit, state], queryFn: () => EmailTransactionService.getAll(page, limit, state) });
}
