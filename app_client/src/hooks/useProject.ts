import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectService from "../services/projectService";
import { ProjectType } from "../types/projectType";

export const useGetProject = (_id: string) => {
    return useQuery({ queryKey: ['project', _id], queryFn: () => ProjectService.get(_id) });
}

export const useGetProjects = (page: number, limit: number) => {
    return useQuery({ queryKey: ['projects', page, limit], queryFn: () => ProjectService.getAll(page, limit) });
}

export const useCreateProject = () => {
    return useMutation({
        mutationFn: (body: { title: string }) =>
            ProjectService.create({ title: body.title } )
    });
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ( body: { _id: string, title: string }) => {
            return await ProjectService.update( body._id, { title: body.title } )
        },
        onSuccess: (project: ProjectType) => queryClient.setQueryData(['project', project._id], () => project)
    });
}

export const useDestroyProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: string) => {
            await ProjectService.destroy(_id)
            return _id;
        },
        onSuccess: (_id: string) => {
            queryClient.setQueryData(['project', _id], null);
        }
    });
}
