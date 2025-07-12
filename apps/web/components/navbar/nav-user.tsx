"use client";

import {
	IconDotsVertical,
	IconLogout,
	IconUserCircle,
} from "@tabler/icons-react";

import { logout } from "@/lib/redux-store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-store/hooks";
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
import { Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeSwitcher } from "../theme-switcher";

interface UserInfo {
	email: string | null;
	name?: string;
	image?: string;
}

export function NavUser() {
	const { isMobile } = useSidebar();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	const { email, loading } = useAppSelector((state) => state.auth);

	const user: UserInfo = {
		email: email,
		name: email?.split("@")[0] || "User",
	};

	const handleLogout = async () => {
		try {
			dispatch(logout());

			document.cookie =
				"token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to log out");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center gap-3 px-2">
				<Skeleton className="h-8 w-8 rounded-lg" />
				<div className="hidden flex-col items-start gap-1 text-sm lg:flex">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-3 w-28" />
				</div>
			</div>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarFallback className="rounded-lg bg-primary/10 text-primary">
									{user?.email?.charAt(0).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user?.name || "User"}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{user?.email || "No email"}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "top"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg bg-primary/10 text-primary">
										{user?.email?.charAt(0).toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user?.name || "User"}
									</span>
									<span className="truncate text-muted-foreground text-xs">
										{user?.email || "No email"}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>
							<ThemeSwitcher
								defaultValue="system"
								value={theme as "light" | "dark" | "system"}
								onChange={(newTheme) => setTheme(newTheme)}
								className="w-full"
							/>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconUserCircle className="mr-2 h-4 w-4" />
								<span>Account</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							className="cursor-pointer text-destructive focus:text-destructive"
						>
							<IconLogout className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
