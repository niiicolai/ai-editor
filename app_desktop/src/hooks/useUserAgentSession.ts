import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import UserAgentSessionService from "../services/userAgentSessionService";
import { UserAgentSessionType } from '../types/userAgentSessionType';

export const useGetUserAgentSession = (_id: string) => {
    return useQuery({ queryKey: ['user_agent_session', _id], queryFn: () => UserAgentSessionService.get(_id) });
}

export const useGetUserAgentSessions = (page: number, limit: number) => {
    return useQuery({ queryKey: ['user_agent_sessions', page, limit], queryFn: () => UserAgentSessionService.getAll(page, limit) });
}

export const useCreateUserAgentSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { title: string }) =>
            UserAgentSessionService.create({ title: body.title }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_agent_sessions'] })
    });
}

export const useUpdateUserAgentSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ( body: { _id: string, title: string }) => {
            return await UserAgentSessionService.update( body._id, { title: body.title } )
        },
        onSuccess: (session: UserAgentSessionType) => queryClient.setQueryData(['user_agent_session', session._id], () => session)
    });
}

export const useDestroyUserAgentSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (_id: string) => {
            await UserAgentSessionService.destroy(_id)
            return _id;
        },
        onSuccess: (_id: string) => {
            queryClient.setQueryData(['user_agent_session', _id], null);
            queryClient.invalidateQueries({ queryKey: ['user_agent_sessions'] });
        }
    });
}
