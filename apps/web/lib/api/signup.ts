import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import {
	loginFailure,
	loginStart,
	loginSuccess,
} from "../redux-store/auth-slice";
import { api } from "./client";

export interface SignUpCredentials {
	email: string;
	password: string;
	name: string;
}

interface SignUpResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}

export const useSignUpMutation = () => {
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async (credentials: SignUpCredentials) => {
			dispatch(loginStart());
			const response = await api.post<SignUpResponse>("/signup", credentials);
			return response.data;
		},
		onSuccess: (data) => {
			dispatch(loginSuccess({ token: data.token, email: data.user.email }));
		},
		onError: (error: unknown) => {
			let errorMessage = "Signup failed";

			if (error instanceof AxiosError) {
				errorMessage = error.response?.data?.message || "Signup failed";
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			dispatch(loginFailure(errorMessage));
		},
	});
};
