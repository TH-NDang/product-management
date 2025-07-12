import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
	loginFailure,
	loginStart,
	loginSuccess,
} from "../redux-store/auth-slice";
import { api } from "./client";

interface OAuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}

export const useGoogleLogin = () => {
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async () => {
			dispatch(loginStart());
			try {
				// This will redirect to the backend's OAuth endpoint
				window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/oauth2/authorization/google`;
				// This will never be reached as we're redirecting
				return null;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : "Google login failed";
				throw new Error(errorMessage);
			}
		},
		onSuccess: () => {
			// The actual success handling will be done by Spring Boot's OAuth2 flow
			// which will redirect back to the callback URL with the token
		},
		onError: (error: Error) => {
			dispatch(loginFailure(error.message));
			throw error;
		},
	});
};
