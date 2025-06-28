import { roles } from "@/data/data";
import { getRoleColor, getRoleIcon } from "@/lib/members-utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	AlertCircle,
	Mail,
	MoreHorizontal,
	Settings,
	Trash2,
} from "lucide-react";

interface InvitedUserItemProps {
	user: {
		initials: string;
		email: string;
		role: string;
		expires: number;
	};
}

export function InvitedUserItem({ user }: InvitedUserItemProps) {
	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-300 border-dashed bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/20">
			<div className="flex items-center gap-4">
				<div className="flex size-12 items-center justify-center rounded-full border-2 border-gray-300 border-dashed bg-white font-semibold text-gray-500 dark:border-gray-600 dark:bg-gray-950">
					{user.initials}
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-gray-900 text-sm dark:text-gray-50">
						{user.email}
					</p>
					<div className="mt-1 flex items-center gap-2">
						<AlertCircle className="size-3 text-yellow-500" />
						<p className="text-gray-500 text-sm dark:text-gray-400">
							Expires in {user.expires} days
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Badge variant="outline" className={`gap-1 ${getRoleColor(user.role)}`}>
					{getRoleIcon(user.role)}
					{roles.find((r) => r.value === user.role)?.label}
				</Badge>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem>
							<Mail className="mr-2 size-4" />
							Resend invitation
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 size-4" />
							Edit invitation
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600 dark:text-red-400">
							<Trash2 className="mr-2 size-4" />
							Revoke invitation
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
