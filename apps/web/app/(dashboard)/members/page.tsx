"use client";

import { ActiveMembersSection } from "@/components/members/active-members-section";
import { BulkActions } from "@/components/members/bulk-actions";
import { MembersHeader } from "@/components/members/members-header";
import { MembersSearch } from "@/components/members/members-search";
import { MembersStats } from "@/components/members/members-stats";
import { PendingInvitationsSection } from "@/components/members/pending-invitations-section";
import { useMembers } from "@/hooks/use-members";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

export default function Users() {
	const {
		searchQuery,
		setSearchQuery,
		roleFilter,
		setRoleFilter,
		selectedUsers,
		filteredUsers,
		filteredInvitedUsers,
		handleSelectAll,
		handleSelectUser,
		clearSelection,
		handleBulkAction,
	} = useMembers();

	return (
		<TooltipProvider>
			<ScrollArea className="h-full w-full">
				<div className="space-y-6 px-6">
					{/* Header Section */}
					<MembersHeader />

					{/* Statistics Section */}
					<MembersStats />

					{/* Search and Filter Section */}
					<MembersSearch
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						roleFilter={roleFilter}
						setRoleFilter={setRoleFilter}
					/>

					{/* Bulk Actions */}
					<BulkActions
						selectedUsers={selectedUsers}
						onBulkAction={handleBulkAction}
						onClearSelection={clearSelection}
					/>

					{/* Active Members Section */}
					<ActiveMembersSection
						users={filteredUsers}
						selectedUsers={selectedUsers}
						onSelectAll={handleSelectAll}
						onSelectUser={handleSelectUser}
					/>

					{/* Pending Invitations Section */}
					<PendingInvitationsSection invitedUsers={filteredInvitedUsers} />
				</div>
			</ScrollArea>
		</TooltipProvider>
	);
}
