import { LogOut, MoveVertical, Sparkles, User, Users } from "lucide-react";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
						>
							<Avatar className="size-8">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-lg">S</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
							</div>
							<MoveVertical className="ml-auto size-5 text-muted-foreground/80" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="dark w-(--radix-dropdown-menu-trigger-width) bg-sidebar"
						side="bottom"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
								<User size={20} className="size-5 text-muted-foreground/80" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
								<Users size={20} className="size-5 text-muted-foreground/80" />
								Accounts
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
								<Sparkles
									size={20}
									className="size-5 text-muted-foreground/80"
								/>
								Upgrade
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
								<LogOut size={20} className="size-5 text-muted-foreground/80" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
