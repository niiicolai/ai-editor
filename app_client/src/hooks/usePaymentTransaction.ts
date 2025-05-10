import { useQuery } from '@tanstack/react-query';
import PaymentTransactionService from "../services/paymentTransactionService";

export const useGetPaymentTransaction = (_id: string) => {
    return useQuery({ queryKey: ['payment_transaction', _id], queryFn: () => PaymentTransactionService.get(_id) });
}

export const useGetPaymentTransactions = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['payment_transactions', page, limit, state], queryFn: () => PaymentTransactionService.getAll(page, limit, state) });
}
