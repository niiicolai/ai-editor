import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import UserAgentSessionMessageService from "../services/userAgentSessionMessageService";
import { UserAgentSessionMessageType } from '../types/userAgentSessionMessageType';

export const useGetUserAgentSessionMessage = (_id: string) => {
    return useQuery({ queryKey: ['user_agent_session_message', _id], queryFn: () => UserAgentSessionMessageService.get(_id) });
}

export const useGetUserAgentSessionMessages = (page: number, limit: number, user_agent_session_id: string) => {
    return useQuery({ queryKey: ['user_agent_session_messages', page, limit, user_agent_session_id], queryFn: () => UserAgentSessionMessageService.getAll(page, limit, user_agent_session_id) });
}

export const useCreateUserAgentSessionMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { user_agent_session_id:string, content: string, currentFile: { name: string, content: string}, directoryInfo: any }) =>
            UserAgentSessionMessageService.create({ content: body.content, userAgentSessionId: body.user_agent_session_id, currentFile: body.currentFile, directoryInfo: body.directoryInfo  } ),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_agent_session_messages'] })
    });
}

export const useUpdateUserAgentSessionMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ( body: { _id: string, content: string }) => {
            return await UserAgentSessionMessageService.update( body._id, { content: body.content } )
        },
        onSuccess: (message: UserAgentSessionMessageType) => queryClient.setQueryData(['user_agent_session_message', message._id], () => message)
    });
}

export const useDestroyUserAgentSessionMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: string) => {
            await UserAgentSessionMessageService.destroy(_id)
            return _id;
        },
        onSuccess: (_id: string) => {
            queryClient.setQueryData(['user_agent_session', _id], null);
        }
    });
}