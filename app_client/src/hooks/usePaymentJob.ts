import { useQuery } from '@tanstack/react-query';
import PaymentJobService from "../services/paymentJobService";

export const useGetPaymentJob = (_id: string) => {
    return useQuery({ queryKey: ['payment_job', _id], queryFn: () => PaymentJobService.get(_id) });
}

export const useGetPaymentJobs = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['payment_jobs', page, limit, state], queryFn: () => PaymentJobService.getAll(page, limit, state) });
}
