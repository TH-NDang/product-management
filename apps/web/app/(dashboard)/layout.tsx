"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
	SidebarInset,
	SidebarProvider,
} from "@workspace/ui/components/sidebar";

function DashboardContent({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
					height: "100vh",
					overflow: "hidden",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />

				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
						<div className="flex h-full flex-col gap-4 overflow-hidden py-4 md:gap-6 md:py-6">
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
