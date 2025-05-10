import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";
import { UserType } from "../types/userType";

const key = ['user'];

export const useGetUser = () => {
    return useQuery({ queryKey: key, queryFn: UserService.get });
}

export const useIsAuthorized = () => {
    return useQuery({ queryKey: ['user_auth_state'], queryFn: UserService.isAuthorized });
}

export const useGetUserCreditLeft = () => {
    return useQuery({ queryKey: ['user_credit_left'], queryFn: UserService.creditLeft });
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: (credentials: { email: string, password: string }) =>
            UserService.login(credentials.email, credentials.password)
    });
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: (body: { username: string, email: string, password: string }) =>
            UserService.create(body.username, body.email, body.password)
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: { username: string, email: string, password: string }) => {
            return await UserService.update(body.username, body.email, body.password)
        },
        onSuccess: (user: UserType) => queryClient.setQueryData(key, () => user)
    });
}

export const useDestroyUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: UserService.destroy,
        onSuccess: () => {
            queryClient.setQueryData(key, null);
            queryClient.invalidateQueries({ queryKey: key });
        }
    });
}
