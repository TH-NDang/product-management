import { roles } from "@/data/data";
import {
	getAvatarColor,
	getRoleColor,
	getRoleDescription,
	getRoleIcon,
} from "@/lib/members-utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Mail, MoreHorizontal, Settings, Trash2 } from "lucide-react";

interface MemberItemProps {
	user: {
		name: string;
		initials: string;
		email: string;
		role: string;
	};
	isSelected: boolean;
	onSelect: (checked: boolean) => void;
}

export function MemberItem({ user, isSelected, onSelect }: MemberItemProps) {
	return (
		<div
			className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
				isSelected
					? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20"
					: "border-gray-200 dark:border-gray-800"
			}`}
		>
			<div className="flex items-center gap-4">
				<Checkbox checked={isSelected} onCheckedChange={onSelect} />
				<div
					className={`flex size-12 items-center justify-center rounded-full font-semibold text-white ${getAvatarColor(user.name)}`}
				>
					{user.initials}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="truncate font-medium text-gray-900 text-sm dark:text-gray-50">
							{user.name}
						</p>
						{user.role === "admin" && (
							<Badge variant="outline" className="text-xs">
								Owner
							</Badge>
						)}
					</div>
					<p className="truncate text-gray-500 text-sm dark:text-gray-400">
						{user.email}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge
							variant="outline"
							className={`gap-1 ${getRoleColor(user.role)}`}
						>
							{getRoleIcon(user.role)}
							{roles.find((r) => r.value === user.role)?.label}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>
						<p>{getRoleDescription(user.role)}</p>
					</TooltipContent>
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem disabled={user.role === "admin"}>
							<Settings className="mr-2 size-4" />
							Edit permissions
						</DropdownMenuItem>
						<DropdownMenuItem disabled={user.role === "admin"}>
							<Mail className="mr-2 size-4" />
							Send message
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-red-600 dark:text-red-400"
							disabled={user.role === "admin"}
						>
							<Trash2 className="mr-2 size-4" />
							Remove member
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
