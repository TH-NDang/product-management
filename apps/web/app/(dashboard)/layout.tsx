"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth/auth-client";
import { setSession } from "@/lib/features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import type { User } from "@/lib/types";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { configNav } from "@/lib/config";
import {
	SidebarInset,
	SidebarProvider,
} from "@workspace/ui/components/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { data, isPending } = authClient.useSession();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!data && !isPending) {
			router.push(`${configNav.loginLink}`);
		}

		const user: User | null = data?.user
			? {
					name: data.user.name ?? "",
					email: data.user.email ?? "",
					image: data.user.image ?? null,
				}
			: null;

		dispatch(
			setSession({
				user,
				token: data?.session?.token ?? null,
			}),
		);
	}, [data, isPending, router, dispatch]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />

				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							{children}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
