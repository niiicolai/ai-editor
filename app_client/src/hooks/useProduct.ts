import { useQuery } from '@tanstack/react-query';
import ProductService from "../services/productService";

export const useGetProduct = (_id: string) => {
    return useQuery({ queryKey: ['product', _id], queryFn: () => ProductService.get(_id) });
}

export const useGetProducts = (page: number, limit: number, category: string) => {
    return useQuery({ queryKey: ['products', page, limit, category], queryFn: () => ProductService.getAll(page, limit, category) });
}
