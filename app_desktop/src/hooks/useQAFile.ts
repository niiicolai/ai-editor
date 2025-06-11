
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { QAType } from '../types/qaType';
import { insertQA } from '../electron/insertQA';
import { updateQA } from '../electron/updateQA';
import { deleteQA } from '../electron/deleteQA';
import { deleteAllQA } from '../electron/deleteAllQA';
import { vectorSearchQA } from '../electron/vectorSearchQA';
import { textSearchQA } from '../electron/textSearchQA';
import { paginateQA } from '../electron/paginateQA';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useGetQAs = (page: number, limit: number, project_id: string) => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);

    return useQuery({ 
        queryKey: ['qas', page, limit], 
        queryFn: () => paginateQA(page, limit, project_id, embeddingModel)
    });
}

export const useVectorSearchQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const search = async (file_id: string, queryEmbedding: number[]) => {
        setIsLoading(true);

        try {
            return await vectorSearchQA(file_id, queryEmbedding, embeddingModel);            
        } catch (error: unknown) {
            if (error instanceof Error) setError(error.message);
            else setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, error, search };
}

export const useTextSearchQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const search = async (file_id: string, query: string) => {
        setIsLoading(true);

        try {
            return await textSearchQA(file_id, query, embeddingModel);            
        } catch (error: unknown) {
            if (error instanceof Error) setError(error.message);
            else setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, error, search };
}

export const useCreateQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: QAType) => insertQA(body, embeddingModel),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
    });
}

export const useUpdateQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: QAType }) => {
            updateQA(id, body, embeddingModel);
            return Promise.resolve({ id });
        },
        onSuccess: ({ id }) => {
            queryClient.invalidateQueries({ queryKey: ['embedded_files'] })
            queryClient.invalidateQueries({ queryKey: ['embedded_file', id] })
        }
    });
}

export const useDestroyQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: number) => {
            await deleteQA(_id, embeddingModel)
            return _id;
        },
        onSuccess: (_id: number) => {
            queryClient.setQueryData(['qa', _id], null);
        }
    });
}

export const useDestroyAllQA = () => {
    const { embeddingModel } = useSelector((state: RootState) => state.rag);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (project_id: string) => {
            await deleteAllQA(project_id, embeddingModel)
            return project_id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qas'] })
        }
    });
}

