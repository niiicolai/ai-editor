import { useMutation } from '@tanstack/react-query';
import UserPasswordRestService from "../services/userPasswordResetService";

export const useCreateUserPasswordReset = () => {
    return useMutation({
        mutationFn: (body: { email: string }) =>
            UserPasswordRestService.create(body)
    });
}

export const useUpdateUserPasswordReset = () => {
    return useMutation({
        mutationFn: (body: { _id: string, password: string }) =>
            UserPasswordRestService.update(body)
    });
}

