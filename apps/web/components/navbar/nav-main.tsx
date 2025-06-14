"use client";

import { Button } from "@workspace/ui/components/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Calendar, CirclePlus, Home, Mail, Users } from "lucide-react";

interface NavMainProps {
	title: string;
	url: string;
	icon?: React.ElementType;
}

export function NavMain({
	...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const main: NavMainProps[] = [
		{
			title: "Home",
			url: "#",
			icon: Home,
		},
		{
			title: "Timeline",
			url: "#",
			icon: Calendar,
		},
		{
			title: "Members",
			url: "#",
			icon: Users,
		},
	];
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{main.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
