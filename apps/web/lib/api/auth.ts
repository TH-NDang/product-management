import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
	loginFailure,
	loginStart,
	loginSuccess,
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
		email: string;
		token: string;
		expiresAt: number;
	};
	success: boolean;
}

export const useLoginMutation = () => {
	const dispatch = useAppDispatch();
	return useMutation({
		mutationFn: async (credentials: LoginCredentials) => {
			try {
				dispatch(loginStart());
				const response = await api.post<LoginResponse>(
					"/auth/login",
					credentials,
				);

				return response.data;
			} catch (error: unknown) {
				let errorMessage = "Login failed";

				if (error instanceof AxiosError) {
					errorMessage = error.response?.data?.message || "Login failed";
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}

				throw new Error(errorMessage);
			}
		},
		onSuccess: async (response) => {
			if (response.success && response.data) {
				dispatch(
					loginSuccess({
						token: response.data.token,
						email: response.data.email,
					}),
				);

				return response;
			}
			throw new Error(response.message || "Login failed");
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error ? error.message : "Login failed";
			dispatch(loginFailure(errorMessage));
			if (typeof window !== "undefined") {
				const toast = require("sonner").toast;
				toast.error(errorMessage);
			}
		},
	});
};
