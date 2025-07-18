"use client";

import { type AppStore, makeStore } from "@/lib/redux-store/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const storeRef = useRef<AppStore | null>(null);
	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore();
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
