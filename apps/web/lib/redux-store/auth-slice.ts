import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authService } from "../api/auth-service";
import type { AppDispatch } from "./store";

export interface AuthState {
	token: string | null;
	email: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	token: null,
	email: "",
	isAuthenticated: false,
	loading: true, // Start with loading true
	error: null,
};

export const initializeAuth = () => (dispatch: AppDispatch) => {
	dispatch(setAuthLoading(true));
	try {
		const token =
			typeof window !== "undefined" ? localStorage.getItem("token") : null;
		const email =
			typeof window !== "undefined" ? localStorage.getItem("email") : null;
		if (token && email) {
			dispatch(
				loginSuccess({
					token,
					email,
				}),
			);
		}
	} catch (error) {
		console.error("Error initializing auth state:", error);
	} finally {
		dispatch(setAuthLoading(false));
	}
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		loginSuccess: (
			state,
			action: PayloadAction<{ token: string; email: string }>,
		) => {
			state.token = action.payload.token;
			state.email = action.payload.email;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;

			// Store token in localStorage and cookies
			if (typeof window !== "undefined") {
				try {
					localStorage.setItem("token", action.payload.token);
					localStorage.setItem("email", action.payload.email);

					const expires = new Date();
					expires.setDate(expires.getDate() + 1); // 1 day from now

					document.cookie = `token=${action.payload.token}; expires=${expires.toUTCString()}; path=/; sameSite=Lax; secure`;
				} catch (error) {
					console.error("Error storing auth token:", error);
				}
			}
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		setAuthLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		logout: (state) => {
			state.token = null;
			state.email = "";
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
			localStorage.removeItem("token");
			localStorage.removeItem("email");
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	setAuthLoading,
} = authSlice.actions;
export default authSlice.reducer;
