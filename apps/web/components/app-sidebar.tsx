"use client";

import type * as React from "react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavProjects } from "@/components/navbar/nav-projects";
import { NavSecondary } from "@/components/navbar/nav-secondary";
import { NavUser } from "@/components/navbar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@workspace/ui/components/sidebar";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<NavProjects />
				<NavSecondary className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
