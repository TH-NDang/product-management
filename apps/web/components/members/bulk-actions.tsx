import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { CheckCircle, Download, Mail, UserX } from "lucide-react";

interface BulkActionsProps {
	selectedUsers: string[];
	onBulkAction: (action: string) => void;
	onClearSelection: () => void;
}

export function BulkActions({
	selectedUsers,
	onBulkAction,
	onClearSelection,
}: BulkActionsProps) {
	if (selectedUsers.length === 0) return null;

	return (
		<Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
			<CardContent className="pt-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<CheckCircle className="size-5 text-blue-600 dark:text-blue-400" />
						<span className="font-medium text-blue-900 text-sm dark:text-blue-100">
							{selectedUsers.length} member{selectedUsers.length > 1 ? "s" : ""}{" "}
							selected
						</span>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onBulkAction("message")}
							className="gap-2"
						>
							<Mail className="size-4" />
							Message
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onBulkAction("export")}
							className="gap-2"
						>
							<Download className="size-4" />
							Export
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onBulkAction("remove")}
							className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
						>
							<UserX className="size-4" />
							Remove
						</Button>
						<Button variant="ghost" size="sm" onClick={onClearSelection}>
							Clear
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
