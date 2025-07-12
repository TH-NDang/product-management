import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
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
	loading: false,
	error: null,
};

export const initializeAuth = () => (dispatch: AppDispatch) => {
	try {
		const token =
			typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (token) {
			dispatch(
				loginSuccess({
					token,
					email: "",
				}),
			);
		}
	} catch (error) {
		console.error("Error initializing auth state:", error);
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
		logout: (state) => {
			state.token = null;
			state.email = "";
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
			localStorage.removeItem("token");
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, logout } =
	authSlice.actions;
export default authSlice.reducer;
