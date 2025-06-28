"use client";

import {
	type Icon,
	IconDots,
	IconFolder,
	IconShare3,
	IconTrash,
} from "@tabler/icons-react";

import { useNavigation } from "@/lib/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";

export function NavProjects() {
	const { isMobile } = useSidebar();
	const { projectNav, isActive } = useNavigation();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarGroupAction title="Add Project">
				<Plus /> <span className="sr-only">Add Project</span>
			</SidebarGroupAction>
			<SidebarGroupContent>
				<SidebarMenu>
					{projectNav.map((item) => {
						const active = isActive(item.url);

						return (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton
									asChild
									isActive={active}
									tooltip={item.name}
								>
									<Link href={item.url}>
										<item.icon />
										<span>{item.name}</span>
									</Link>
								</SidebarMenuButton>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction
											showOnHover
											className="rounded-sm data-[state=open]:bg-accent"
										>
											<IconDots />
											<span className="sr-only">More</span>
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-24 rounded-lg"
										side={isMobile ? "bottom" : "right"}
										align={isMobile ? "end" : "start"}
									>
										<DropdownMenuItem>
											<IconFolder />
											<span>Open</span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<IconShare3 />
											<span>Share</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem variant="destructive">
											<IconTrash />
											<span>Delete</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						);
					})}
					<SidebarMenuItem>
						<SidebarMenuButton className="text-sidebar-foreground/70">
							<IconDots className="text-sidebar-foreground/70" />
							<span>More</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
