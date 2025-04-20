import { useQuery } from '@tanstack/react-query';
import UserProductService from "../services/userProductService";

export const useGetCreditInfo = () => {
    return useQuery({ queryKey: ['credit_info'], queryFn: () => UserProductService.getCreditInfo() })
}
