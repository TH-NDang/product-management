"use client";

import {
	type Icon,
	IconDots,
	IconFolder,
	IconShare3,
	IconTrash,
} from "@tabler/icons-react";

import { useInfiniteQueryAPI } from "@/hooks/use-infinite-query";
import { type Project, useNavigation } from "@/lib/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
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
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function NavProjects() {
	const { isMobile } = useSidebar();
	const { isActive, navUtils } = useNavigation();

	// Fetch projects using the API
	const {
		data: projects,
		isLoading,
		isFetching,
		hasMore,
		fetchNextPage,
		error,
	} = useInfiniteQueryAPI<Project>({
		endpoint: "/projects",
		pageSize: 10,
	});

	// Convert projects to nav items
	const projectNavItems = projects.map((project) =>
		navUtils.projectToNavItem(project),
	);

	// Load more projects when scrolling
	useEffect(() => {
		if (hasMore && !isFetching) {
			fetchNextPage();
		}
	}, [hasMore, isFetching, fetchNextPage]);

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarGroupAction title="Add Project">
				<Plus /> <span className="sr-only">Add Project</span>
			</SidebarGroupAction>
			<SidebarGroupContent>
				<ScrollArea className="h-[300px] w-full">
					<SidebarMenu>
						{isLoading ? (
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Loading projects...</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						) : error ? (
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<span>Error loading projects</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						) : projectNavItems.length === 0 ? (
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<span>No projects found</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						) : (
							projectNavItems.map((item) => {
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
							})
						)}
						{isFetching && hasMore && (
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Loading more...</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</ScrollArea>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
