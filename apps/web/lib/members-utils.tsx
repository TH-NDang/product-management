import { Crown, Eye, Shield, UserCheck, Users } from "lucide-react";

// Helper function to generate avatar colors
export const getAvatarColor = (name: string) => {
	const colors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-purple-500",
		"bg-pink-500",
		"bg-indigo-500",
		"bg-yellow-500",
		"bg-red-500",
		"bg-teal-500",
	];
	const index = name.charCodeAt(0) % colors.length;
	return colors[index];
};

// Helper function to get role icon
export const getRoleIcon = (role: string) => {
	switch (role) {
		case "admin":
			return <Crown className="size-3" />;
		case "member":
			return <Shield className="size-3" />;
		case "contributor":
			return <UserCheck className="size-3" />;
		case "viewer":
			return <Eye className="size-3" />;
		default:
			return <Users className="size-3" />;
	}
};

// Helper function to get role color
export const getRoleColor = (role: string) => {
	switch (role) {
		case "admin":
			return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
		case "member":
			return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
		case "contributor":
			return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
		case "viewer":
			return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
		default:
			return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
	}
};

// Helper function to get role description
export const getRoleDescription = (role: string) => {
	switch (role) {
		case "admin":
			return "Full access to everything";
		case "member":
			return "Can edit and manage content";
		case "contributor":
			return "Can create and edit content";
		case "viewer":
			return "Can view content only";
		default:
			return "Limited access";
	}
};

// Helper function to validate email
export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Helper function to parse and validate multiple emails
export const parseEmails = (emailString: string) => {
	const emails = emailString
		.split(/[,\n]/)
		.map((email) => email.trim())
		.filter((email) => email.length > 0);

	const validEmails = emails.filter(validateEmail);
	const invalidEmails = emails.filter((email) => !validateEmail(email));

	return {
		valid: validEmails,
		invalid: invalidEmails,
		all: emails,
	};
};

// Helper function to get user status
export const getUserStatus = (user: {
	role: string;
	lastActive?: string | Date;
}) => {
	if (user.role === "admin") return "active";
	if (user.lastActive) {
		const lastActive = new Date(user.lastActive);
		const now = new Date();
		const diffDays = Math.floor(
			(now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (diffDays <= 7) return "active";
		if (diffDays <= 30) return "recent";
		return "inactive";
	}
	return "unknown";
};

// Helper function to get status color
export const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
		case "recent":
			return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
		case "inactive":
			return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
		default:
			return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
	}
};
