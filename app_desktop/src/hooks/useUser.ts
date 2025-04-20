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
