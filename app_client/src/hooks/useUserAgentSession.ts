import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import UserAgentSessionService from "../services/userAgentSessionService";
import { UserAgentSessionType, UserAgentSessionsType } from "../types/userAgentSessionType";

export const useGetUserAgentSessionMessage = (_id: string) => {
    return useQuery({ 
        queryKey: ['user_agent_session', _id], 
        queryFn: () => UserAgentSessionService.get(_id) 
    });
}

export const useGetUserAgentSessionMessages = (page: number, limit: number) => {
    return useQuery({ 
        queryKey: ['user_agent_sessions', page, limit], 
        queryFn: () => UserAgentSessionService.getAll(page, limit) 
    });
}

export const useCreateUserAgentSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string }) => UserAgentSessionService.create(data),
        onSuccess: (data: UserAgentSessionType) => {
            // Update the cache with the new session
            queryClient.setQueriesData<UserAgentSessionsType>(
                { queryKey: ['user_agent_sessions'] },
                (oldData) => {
                    if (!oldData) return { 
                        sessions: [data], 
                        pages: 1,
                        total: 1,
                        limit: 10,
                        page: 1
                    };
                    return {
                        ...oldData,
                        sessions: [data, ...oldData.sessions],
                        total: oldData.total + 1
                    };
                }
            );
        }
    });
}
