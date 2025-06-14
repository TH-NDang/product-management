import type { Session } from "@/lib/auth";
import type { RootState } from "@/lib/store";
import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
	session: Session | null;
}

const initialState: AuthState = {
	session: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setSession: (state, action: PayloadAction<{ session: Session | null }>) => {
			state.session = action.payload.session;
		},
		logout: (state) => {
			state.session = null;
		},
	},
});

export const { setSession, logout } = authSlice.actions;

export default authSlice.reducer;
