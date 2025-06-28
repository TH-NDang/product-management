import { ModalAddUser } from "@/components/settings/modal-add-user";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

export function MembersHeader() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="font-bold text-2xl text-gray-900 tracking-tight dark:text-gray-50">
					Team Members
				</h1>
				<p className="text-gray-500 text-sm dark:text-gray-400">
					Manage your workspace members and their permissions
				</p>
			</div>
			<div className="flex gap-2">
				<ModalAddUser>
					<Button className="gap-2">
						<Plus className="size-4" />
						Add Member
					</Button>
				</ModalAddUser>
			</div>
		</div>
	);
}
