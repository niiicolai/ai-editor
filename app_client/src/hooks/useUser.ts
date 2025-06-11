import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";
import { UserType } from "../types/userType";

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
    return useMutation({
        mutationFn: async (body: { username: string, email: string, password: string }) =>
            await UserService.create(body.username, body.email, body.password)
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: { username: string, email: string, password: string }) => {
            return await UserService.update(body.username, body.email, body.password)
        },
        onSuccess: (user: UserType) => queryClient.setQueryData(['user'], () => user)
    });
}

export const useDestroyUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => await UserService.destroy(),
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['user_auth_state'] })
            queryClient.invalidateQueries({ queryKey: ['user_credit_left'] })
        }
    });
}
