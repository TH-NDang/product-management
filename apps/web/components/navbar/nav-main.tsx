"use client";

import { useNavigation } from "@/lib/config";
import { Button } from "@workspace/ui/components/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Calendar, CirclePlus, Home, Mail, Users } from "lucide-react";
import Link from "next/link";

export function NavMain({
	...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const { mainNav, isActive } = useNavigation();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{mainNav.map((item) => {
						const active = isActive(item.url);

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={active}
									tooltip={item.title}
								>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
