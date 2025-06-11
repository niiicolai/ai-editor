import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";

export const useGetUser = () => {
    return useQuery({ queryKey: ['user'], queryFn: async () => await UserService.get() });
}

export const useIsAuthorized = () => {
    return useQuery({ queryKey: ['user_auth_state'], queryFn: async () => await UserService.isAuthorized() });
}

export const useGetUserCreditLeft = () => {
    return useQuery({ queryKey: ['user_credit_left'], queryFn: async () => await UserService.creditLeft() });
}

export const useLoginUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (credentials: { email: string, password: string }) =>
            await UserService.login(credentials.email, credentials.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['user_auth_state'] })
            queryClient.invalidateQueries({ queryKey: ['user_credit_left'] })
        }
    });
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (body: { username: string, email: string, password: string }) =>
            await UserService.create(body.username, body.email, body.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['user_auth_state'] })
            queryClient.invalidateQueries({ queryKey: ['user_credit_left'] })
        }
    });
}
