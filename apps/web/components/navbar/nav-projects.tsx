"use client";

import {
	type Icon,
	IconDots,
	IconFolder,
	IconShare3,
	IconTrash,
} from "@tabler/icons-react";

import {
	useDeleteProject,
	useProjectsWithRedux,
} from "@/hooks/use-projects-query";
import { type Project, useNavigation } from "@/lib/config";
import { useAppSelector } from "@/lib/redux-store/hooks";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
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
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AddProjectModal } from "./add-project-modal";

export function NavProjects() {
	const { isMobile } = useSidebar();
	const searchParams = useSearchParams();
	const currentProjectId = searchParams.get('id');
	const { navUtils } = useNavigation();
	const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const activeTeamId = useAppSelector((state) => state.team.activeTeamId);

	const {
		data: projects = [],
		isLoading,
		isFetching,
		error,
	} = useProjectsWithRedux(activeTeamId || "");

	// Use delete mutation for the active team
	const deleteMutation = useDeleteProject(activeTeamId || "");

	const projectNavItems = projects.map((project: Project) =>
		navUtils.projectToNavItem(project),
	);

	const handleDeleteProject = async (
		projectId: string,
		projectName: string,
	) => {
		setDeletingProjectId(projectId);
		setOpenDropdownId(null);
		setShowDeleteDialog(null);

		try {
			await deleteMutation.mutateAsync(projectId);
			toast.success(`Project "${projectName}" deleted successfully`);
		} catch (error) {
			toast.error("Failed to delete project");
		} finally {
			setDeletingProjectId(null);
		}
	};

	const handleProjectCreated = () => {
		toast.success("Project created successfully!");
	};

	const handleDeleteClick = (projectId: string, projectName: string) => {
		setShowDeleteDialog({ id: projectId, name: projectName });
		setOpenDropdownId(null); // Close dropdown
	};

	return (
		<>
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>Projects</SidebarGroupLabel>
				<SidebarGroupAction title="Add Project">
					{activeTeamId && (
						<AddProjectModal
							teamId={activeTeamId}
							onProjectCreated={handleProjectCreated}
						/>
					)}
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
							) : !activeTeamId ? (
								<SidebarMenuItem>
									<SidebarMenuButton className="text-sidebar-foreground/70">
										<span>Select a team to see projects</span>
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
									const projectId = item.url.split('id=')[1];
const active = projectId === currentProjectId;
									const project = projects.find(
										(p: Project) => `/project?id=${p.id}` === item.url,
									);
									const isDropdownOpen = openDropdownId === project?.id;

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
											<DropdownMenu
												open={isDropdownOpen}
												onOpenChange={(open) =>
													setOpenDropdownId(open ? project?.id || null : null)
												}
											>
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
														<IconShare3 />
														<span>Share</span>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														variant="destructive"
														disabled={
															deleteMutation.isPending &&
															deletingProjectId === project?.id
														}
														onClick={() =>
															project &&
															handleDeleteClick(project.id, project.name)
														}
													>
														{deleteMutation.isPending &&
															deletingProjectId === project?.id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<IconTrash />
														)}
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</SidebarMenuItem>
									);
								})
							)}
							{isFetching && (
								<SidebarMenuItem>
									<SidebarMenuButton className="text-sidebar-foreground/70">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Refreshing...</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}
						</SidebarMenu>
					</ScrollArea>
				</SidebarGroupContent>
			</SidebarGroup>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!showDeleteDialog}
				onOpenChange={(open) => !open && setShowDeleteDialog(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Project</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{showDeleteDialog?.name}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								showDeleteDialog &&
								handleDeleteProject(showDeleteDialog.id, showDeleteDialog.name)
							}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
