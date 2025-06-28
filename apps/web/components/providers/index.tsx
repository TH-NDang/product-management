"use client";

import { AuthProvider } from "@/lib/supabase/auth-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";
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
				<NuqsAdapter>
					<AuthProvider>{children}</AuthProvider>
				</NuqsAdapter>
			</StoreProvider>
		</NextThemesProvider>
	);
}
