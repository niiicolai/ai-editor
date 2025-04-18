import { useQuery } from '@tanstack/react-query';
import UserAgentMessageService from "../services/userAgentSessionMessageService";

export const useGetUserAgentSessionMessage = (_id: string) => {
    return useQuery({ queryKey: ['user_agent_session_message', _id], queryFn: () => UserAgentMessageService.get(_id) });
}

export const useGetUserAgentSessionMessages = (page: number, limit: number, user_agent_session_id: string) => {
    return useQuery({ queryKey: ['user_agent_session_messages', page, limit, user_agent_session_id], queryFn: () => UserAgentMessageService.getAll(page, limit, user_agent_session_id) });
}
