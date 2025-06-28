import { invitedUsers, users } from "@/data/data";
import { useMemo, useState } from "react";

export function useMembers() {
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	// Filter users based on search and role filter
	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [searchQuery, roleFilter]);

	const filteredInvitedUsers = useMemo(() => {
		return invitedUsers.filter((user) => {
			const matchesSearch = user.email
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [searchQuery, roleFilter]);

	// Handle bulk selection
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedUsers(filteredUsers.map((user) => user.name));
		} else {
			setSelectedUsers([]);
		}
	};

	const handleSelectUser = (userName: string, checked: boolean) => {
		if (checked) {
			setSelectedUsers((prev) => [...prev, userName]);
		} else {
			setSelectedUsers((prev) => prev.filter((name) => name !== userName));
		}
	};

	const clearSelection = () => {
		setSelectedUsers([]);
	};

	// Bulk actions
	const handleBulkAction = (action: string) => {
		console.log(`Bulk action: ${action} for users:`, selectedUsers);
		// Implement bulk actions here
	};

	return {
		// State
		searchQuery,
		setSearchQuery,
		roleFilter,
		setRoleFilter,
		selectedUsers,

		// Filtered data
		filteredUsers,
		filteredInvitedUsers,

		// Actions
		handleSelectAll,
		handleSelectUser,
		clearSelection,
		handleBulkAction,
	};
}
