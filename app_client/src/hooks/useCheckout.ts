import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import CheckoutService from "../services/checkoutService";
import { CheckoutType } from '../types/checkoutType';

export const useGetCheckout = (_id: string) => {
    return useQuery({ queryKey: ['checkout', _id], queryFn: () => CheckoutService.get(_id) });
}

export const useGetCheckouts = (page: number, limit: number, state: string) => {
    return useQuery({ queryKey: ['checkouts', page, limit, state], queryFn: () => CheckoutService.getAll(page, limit, state) });
}

export const useGetOrCreateCheckout = () => {
    return useQuery({ queryKey: ['checkout'], queryFn: () => CheckoutService.getOrCreate() });
}

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: (body: { products: [{
            product: string,
            quantity: number,
        }]}) =>
            CheckoutService.create(body.products)
    });
}

export const useUpdateCheckout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: { _id: string, products: [{
            product: string,
            quantity: number,
        }] }) => {
            return await CheckoutService.update(body._id, body.products)
        },
        onSuccess: (checkout: CheckoutType) => queryClient.setQueryData(['checkout'], () => checkout)
    });
}

export const useStartCheckout = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await CheckoutService.startCheckout(_id)
        },
    });
}
