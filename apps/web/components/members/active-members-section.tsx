import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Users as UsersIcon } from "lucide-react";
import { MemberItem } from "./member-item";

interface ActiveMembersSectionProps {
	users: Array<{
		name: string;
		initials: string;
		email: string;
		role: string;
	}>;
	selectedUsers: string[];
	onSelectAll: (checked: boolean) => void;
	onSelectUser: (userName: string, checked: boolean) => void;
}

export function ActiveMembersSection({
	users,
	selectedUsers,
	onSelectAll,
	onSelectUser,
}: ActiveMembersSectionProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<UsersIcon className="size-5" />
						Active Members ({users.length})
					</CardTitle>
					{users.length > 0 && (
						<div className="flex items-center gap-2">
							<Checkbox
								checked={selectedUsers.length === users.length}
								onCheckedChange={onSelectAll}
							/>
							<span className="text-gray-500 text-sm">Select all</span>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{users.length === 0 ? (
					<div className="py-8 text-center">
						<UsersIcon className="mx-auto size-12 text-gray-400" />
						<h3 className="mt-2 font-medium text-gray-900 text-sm dark:text-gray-50">
							No members found
						</h3>
						<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
							Try adjusting your search or filter criteria.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{users.map((user) => (
							<MemberItem
								key={user.name}
								user={user}
								isSelected={selectedUsers.includes(user.name)}
								onSelect={(checked) => onSelectUser(user.name, checked)}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
