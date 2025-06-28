import { invitedUsers, roles, users } from "@/data/data";
import { getRoleColor, getRoleIcon } from "@/lib/members-utils";
import { Badge } from "@workspace/ui/components/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	Clock,
	Crown,
	Eye,
	Shield,
	TrendingUp,
	UserCheck,
	UserPlus,
	Users,
} from "lucide-react";

export function MembersStats() {
	// Calculate statistics
	const totalMembers = users.length;
	const pendingInvitations = invitedUsers.length;
	const roleCounts = roles.reduce(
		(acc, role) => {
			acc[role.value] = users.filter((user) => user.role === role.value).length;
			return acc;
		},
		{} as Record<string, number>,
	);

	const stats = [
		{
			title: "Total Members",
			value: totalMembers,
			icon: Users,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-950/20",
		},
		{
			title: "Pending Invitations",
			value: pendingInvitations,
			icon: Clock,
			color: "text-yellow-600 dark:text-yellow-400",
			bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
		},
		{
			title: "Active This Week",
			value: Math.floor(totalMembers * 0.8), // Mock data
			icon: TrendingUp,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-950/20",
		},
		{
			title: "New This Month",
			value: Math.floor(totalMembers * 0.2), // Mock data
			icon: UserPlus,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-950/20",
		},
	];

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardContent className="pt-6">
							<div className="flex items-center gap-4">
								<div
									className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}
								>
									<stat.icon className={`size-6 ${stat.color}`} />
								</div>
								<div>
									<p className="font-bold text-2xl text-gray-900 dark:text-gray-50">
										{stat.value}
									</p>
									<p className="text-gray-500 text-sm dark:text-gray-400">
										{stat.title}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Role Distribution */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="size-5" />
						Role Distribution
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{roles.map((role) => {
							const count = roleCounts[role.value] || 0;
							const percentage =
								totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;

							return (
								<div
									key={role.value}
									className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
								>
									<div className="flex items-center gap-3">
										<div
											className={`flex size-10 items-center justify-center rounded-full ${getRoleColor(role.value)}`}
										>
											{getRoleIcon(role.value)}
										</div>
										<div>
											<p className="font-medium text-gray-900 text-sm dark:text-gray-50">
												{role.label}
											</p>
											<p className="text-gray-500 text-xs dark:text-gray-400">
												{count} member{count !== 1 ? "s" : ""}
											</p>
										</div>
									</div>
									<Badge variant="outline" className="text-xs">
										{percentage}%
									</Badge>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
