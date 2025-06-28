import {
	type Action,
	type ThunkAction,
	configureStore,
} from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth-slice";
import projectsReducer from "./projects-slice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			projects: projectsReducer,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
