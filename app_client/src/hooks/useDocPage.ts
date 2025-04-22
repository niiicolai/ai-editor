import { useQuery } from '@tanstack/react-query';
import DocPageService from "../services/docPageService";

export const useGetOrderedDocPage = () => {
    return useQuery({ queryKey: ['doc_pages'], queryFn: () => DocPageService.getOrdered() });
}
