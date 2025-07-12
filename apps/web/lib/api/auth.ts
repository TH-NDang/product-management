import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
	loginFailure,
	loginStart,
	loginSuccess,
	logout,
} from "../redux-store/auth-slice";
import { useAppDispatch } from "../redux-store/hooks";
import { api } from "./client";

interface LoginCredentials {
	email: string;
	password: string;
}

interface LoginResponse {
	status: number;
	message: string;
	data: {
		userId: string;
		email: string;
		token: string;
		expiresAt: number;
	};
	success: boolean;
}

export const useLoginMutation = () => {
	const dispatch = useAppDispatch();
	return useMutation<LoginResponse, Error, LoginCredentials>({
		mutationFn: async (credentials: LoginCredentials) => {
			const response = await api.post<LoginResponse>(
				"/api/auth/login",
				credentials,
			);
			if (!response.data.success) {
				throw new Error(response.data.message || "Login failed");
			}
			return response.data;
		},
		onMutate: () => {
			dispatch(loginStart());
		},
		onSuccess: (data) => {
			if (data.success && data.data) {
				dispatch(
					loginSuccess({
						token: data.data.token,
						email: data.data.email,
						userId: data.data.userId,
					}),
				);
			}
		},
		onError: (error: Error) => {
			dispatch(loginFailure(error.message));
		},
	});
};
