
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { EmbeddedFileType } from '../types/embeddedFileType';
import { insertEmbeddedFile } from '../electron/insertEmbeddedFile';
import { updateEmbeddedFile } from '../electron/updateEmbeddedFile';
import { deleteEmbeddedFile } from '../electron/deleteEmbeddedFile';
import { deleteAllEmbeddedFiles } from '../electron/deleteAllEmbeddedFiles';
import { vectorSearchEmbeddedFiles } from '../electron/vectorSearchEmbeddedFiles';
import { textSearchEmbeddedFiles } from '../electron/textSearchEmbeddedFiles';
import { paginateEmbeddedFiles } from '../electron/paginateEmbeddedFiles';
import { useState } from 'react';

export const useGetEmbeddedFiles = (page: number, limit: number, project_id: string) => {
    return useQuery({ 
        queryKey: ['embedded_files', page, limit], 
        queryFn: () => paginateEmbeddedFiles(page, limit, project_id)
    });
}

export const useVectorSearchEmbeddedFiles = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const search = async (project_id: string, queryEmbedding: number[]) => {
        setIsLoading(true);

        try {
            return await vectorSearchEmbeddedFiles(project_id, queryEmbedding);            
        } catch (error: unknown) {
            if (error instanceof Error) setError(error.message);
            else setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, error, search };
}

export const useTextSearchEmbeddedFiles = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const search = async (project_id: string, query: string) => {
        setIsLoading(true);

        try {
            return await textSearchEmbeddedFiles(project_id, query);            
        } catch (error: unknown) {
            if (error instanceof Error) setError(error.message);
            else setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, error, search };
}

export const useCreateEmbeddedFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: EmbeddedFileType) => insertEmbeddedFile(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
    });
}

export const useUpdateEmbeddedFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: EmbeddedFileType }) => {
            updateEmbeddedFile(id, body);
            return Promise.resolve({ id });
        },
        onSuccess: ({ id }) => {
            queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
            queryClient.invalidateQueries({ queryKey: ['embedded_file', id] })
        }
    });
}

export const useDestroyEmbeddedFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: number) => {
            await deleteEmbeddedFile(_id)
            return _id;
        },
        onSuccess: (_id: number) => {
            queryClient.setQueryData(['embedded_file', _id], null);
        }
    });
}

export const useDestroyEmbeddedFiles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (project_id: string) => {
            await deleteAllEmbeddedFiles(project_id)
            return project_id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
        }
    });
}

