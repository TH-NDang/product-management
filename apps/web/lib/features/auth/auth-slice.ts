import type { RootState } from "@/lib/store";
import type { User } from "@/lib/types";
import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
	user: User | null;
	token: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setSession: (
			state,
			action: PayloadAction<{ user: User | null; token: string | null }>,
		) => {
			if (action.payload.user) {
				state.user = action.payload.user;
			} else {
				state.user = null;
			}
			state.token = action.payload.token;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
		},
	},
});

export const { setSession, logout } = authSlice.actions;

export default authSlice.reducer;
