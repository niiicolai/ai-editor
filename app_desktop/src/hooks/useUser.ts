import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";

export const useGetUser = () => {
    return useQuery({ queryKey: ['user'], queryFn: UserService.get });
}

export const useIsAuthorized = () => {
    return useQuery({ queryKey: ['user_auth_state'], queryFn: UserService.isAuthorized });
}

export const useGetUserCreditLeft = () => {
    return useQuery({ queryKey: ['user_credit_left'], queryFn: UserService.creditLeft });
}

export const useLoginUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (credentials: { email: string, password: string }) =>
            UserService.login(credentials.email, credentials.password),
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
        mutationFn: (body: { username: string, email: string, password: string }) =>
            UserService.create(body.username, body.email, body.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['user_auth_state'] })
            queryClient.invalidateQueries({ queryKey: ['user_credit_left'] })
        }
    });
}
