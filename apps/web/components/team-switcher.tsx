"use client";

import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { type Team, createDefaultTeam, useGetTeamsQuery } from "@/lib/api/team";
import { useAppDispatch, useAppSelector } from "@/lib/redux-store/hooks";
import { setActiveTeam, setTeams } from "@/lib/redux-store/team-slice";
import { useQueryClient } from "@tanstack/react-query";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CreateTeamDialog } from "./create-team-dialog";

export function TeamSwitcher({
	...props
}: React.ComponentPropsWithoutRef<typeof SidebarMenu>) {
	const { isMobile } = useSidebar();
	const [isCreateTeamOpen, setCreateTeamOpen] = React.useState(false);

	const dispatch = useAppDispatch();
	const userId = useAppSelector((state) => state.auth.userId);
	const { activeTeamId, teams } = useAppSelector((state) => state.team);
	const queryClient = useQueryClient();
	const { data: teamsFromApi, isLoading, isError } = useGetTeamsQuery(userId);

	React.useEffect(() => {
		if (teamsFromApi) {
			dispatch(setTeams(teamsFromApi));
		}
	}, [teamsFromApi, dispatch]);

	React.useEffect(() => {
		if (!isLoading && !isError && userId && teamsFromApi?.length === 0) {
			const createTeam = async () => {
				try {
					const newTeam = await createDefaultTeam(userId, {
						name: "My Team",
						description: "Default team created automatically",
					});

					await queryClient.invalidateQueries({ queryKey: ["teams", userId] });
				} catch (error) {
					if (error instanceof AxiosError && error.response?.status === 409) {
						await queryClient.invalidateQueries({
							queryKey: ["teams", userId],
						});
					} else {
						toast.error("Failed to create default team.");
					}
				}
			};

			createTeam();
		}
	}, [isLoading, isError, userId, teamsFromApi, queryClient]);

	const activeTeam = React.useMemo(
		() => teams.find((team) => team.id === activeTeamId),
		[teams, activeTeamId],
	);

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 px-2">
				<Skeleton className="size-8 rounded-lg" />
				<Skeleton className="h-4 w-24" />
			</div>
		);
	}

	if (isError || !teams) {
		return (
			<div className="px-2 text-muted-foreground text-sm">
				Failed to load teams.
			</div>
		);
	}

	return (
		<SidebarMenu {...props}>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{activeTeam ? (
								<>
									<Building2 className="mr-2 size-5 shrink-0" />
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{activeTeam.name}
										</span>
										<span className="text-muted-foreground text-xs">
											{activeTeam.description || "No description"}
										</span>
									</div>
								</>
							) : (
								<span className="text-muted-foreground text-sm">
									No teams found
								</span>
							)}
							<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Available Teams
						</DropdownMenuLabel>
						<DropdownMenuGroup>
							{teams.map((team) => (
								<DropdownMenuItem
									key={team.id}
									onSelect={() => dispatch(setActiveTeam(team.id))}
									className={activeTeam?.id === team.id ? "bg-accent" : ""}
								>
									<Building2 className="mr-2 size-4" />
									<span>{team.name}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => setCreateTeamOpen(true)}>
							<Plus className="mr-2 size-4" />
							<span>Create team</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<CreateTeamDialog
					open={isCreateTeamOpen}
					onOpenChange={setCreateTeamOpen}
					userId={userId}
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
