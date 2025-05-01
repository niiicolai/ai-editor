import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import ProjectIndexService from "../services/projectIndexService";

export const useGetProjectIndex = (_id: string) => {
    return useQuery({ queryKey: ['project_index', _id], queryFn: () => ProjectIndexService.get(_id) });
}

export const useGetProjectIndexByName = (name: string) => {
    return useQuery({ queryKey: ['project_index_by_name', name], queryFn: () => ProjectIndexService.getByName(name) });
}

export const useGetProjectIndexExistByName = (name: string) => {
    return useQuery({ queryKey: ['project_index_exist_by_name', name], queryFn: () => ProjectIndexService.existByName(name) });
}

export const useGetProjectIndexes = (page: number, limit: number) => {
    return useQuery({ queryKey: ['project_indexes', page, limit], queryFn: () => ProjectIndexService.getAll(page, limit) });
}

export const useCreateProjectIndex = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { name: string; }) =>
            ProjectIndexService.create(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_indexes'] })
    });
}

export const useDestroyProjectIndex = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: string) => {
            await ProjectIndexService.destroy(_id)
            return _id;
        },
        onSuccess: (_id: string) => {
            queryClient.setQueryData(['project_index', _id], null);
        }
    });
}