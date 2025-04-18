import { useQuery } from '@tanstack/react-query';
import UserProductService from "../services/userProductService";

export const useGetUserProduct = (_id: string) => {
    return useQuery({ queryKey: ['product', _id], queryFn: () => UserProductService.get(_id) });
}

export const useGetUserProducts = (page: number, limit: number) => {
    return useQuery({ queryKey: ['products', page, limit], queryFn: () => UserProductService.getAll(page, limit) });
}

export const useGetCreditInfo = () => {
    return useQuery({ queryKey: ['credit_info'], queryFn: () => UserProductService.getCreditInfo() })
}
