
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { EmbeddedFileType } from '../types/embeddedFileType';
import { insertEmbeddedFile } from '../electron/insertEmbeddedFile';
import { updateEmbeddedFile } from '../electron/updateEmbeddedFile';
import { deleteEmbeddedFile } from '../electron/deleteEmbeddedFile';
import { deleteAllEmbeddedFiles } from '../electron/deleteAllEmbeddedFiles';
import { paginateEmbeddedFiles } from '../electron/paginateEmbeddedFiles';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useGetEmbeddedFiles = (page: number, limit: number, project_id: string) => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);

    return useQuery({ 
        queryKey: ['embedded_files', page, limit], 
        queryFn: () => paginateEmbeddedFiles(page, limit, project_id, embeddingModel)
    });
}

export const useCreateEmbeddedFile = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: EmbeddedFileType) => insertEmbeddedFile(body, embeddingModel),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
    });
}

export const useUpdateEmbeddedFile = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: EmbeddedFileType }) => {
            updateEmbeddedFile(id, body, embeddingModel);
            return Promise.resolve({ id });
        },
        onSuccess: ({ id }) => {
            queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
            queryClient.invalidateQueries({ queryKey: ['embedded_file', id] })
        }
    });
}

export const useDestroyEmbeddedFile = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: number) => {
            await deleteEmbeddedFile(_id, embeddingModel)
            return _id;
        },
        onSuccess: (_id: number) => {
            queryClient.setQueryData(['embedded_file', _id], null);
        }
    });
}

export const useDestroyEmbeddedFiles = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (project_id: string) => {
            await deleteAllEmbeddedFiles(project_id, embeddingModel)
            return project_id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
        }
    });
}

