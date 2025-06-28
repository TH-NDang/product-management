"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { configNav } from "@/lib/config";
import { useAuth } from "@/lib/supabase/auth-provider";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
	SidebarInset,
	SidebarProvider,
} from "@workspace/ui/components/sidebar";

function DashboardContent({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { user, loading } = useAuth();

	useEffect(() => {
		if (!loading && !user) {
			router.push(`${configNav.loginLink}`);
		}
	}, [user, loading, router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return null; // Sẽ redirect trong useEffect
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

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <DashboardContent>{children}</DashboardContent>;
}
