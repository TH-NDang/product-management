import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Clock } from "lucide-react";
import { InvitedUserItem } from "./invited-user-item";

interface PendingInvitationsSectionProps {
	invitedUsers: Array<{
		initials: string;
		email: string;
		role: string;
		expires: number;
	}>;
}

export function PendingInvitationsSection({
	invitedUsers,
}: PendingInvitationsSectionProps) {
	if (invitedUsers.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="size-5" />
					Pending Invitations ({invitedUsers.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{invitedUsers.map((user) => (
						<InvitedUserItem key={user.initials} user={user} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
