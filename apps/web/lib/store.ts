import {
	type Action,
	type ThunkAction,
	configureStore,
} from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth-slice";
import counterReducer from "./features/counter/counter-slice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			counter: counterReducer,
			auth: authReducer,
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
