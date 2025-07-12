"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";
import ReactQueryProviders from "./query-provider";
import StoreProvider from "./store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			enableColorScheme
		>
			<StoreProvider>
				<ReactQueryProviders>
					<NuqsAdapter>{children}</NuqsAdapter>
				</ReactQueryProviders>
			</StoreProvider>
		</NextThemesProvider>
	);
}
