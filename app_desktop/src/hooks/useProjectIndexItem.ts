import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import ProjectIndexItemService from "../services/projectIndexItemService";
import { ProjectIndexItemCreateType } from '../types/projectIndexItemType';

export const useGetProjectIndexItem = (_id: string) => {
    return useQuery({ queryKey: ['project_index_item', _id], queryFn: () => ProjectIndexItemService.get(_id) });
}

export const useGetProjectIndexItems = (page: number, limit: number, projectIndexId: string) => {
    return useQuery({ queryKey: ['project_index_items', page, limit, projectIndexId], queryFn: () => ProjectIndexItemService.getAll(page, limit, projectIndexId) });
}

export const useCreateProjectIndexItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ProjectIndexItemCreateType) =>
            ProjectIndexItemService.create(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_index_items'] })
    });
}

export const useDestroyProjectIndexItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: string) => {
            await ProjectIndexItemService.destroy(_id)
            return _id;
        },
        onSuccess: (_id: string) => {
            queryClient.setQueryData(['project_index_item', _id], null);
        }
    });
}