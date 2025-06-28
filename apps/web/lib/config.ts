import { IconFolder } from "@tabler/icons-react";
import {
	Calendar,
	CirclePlus,
	HelpCircle,
	Home,
	Mail,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

export interface NavItem {
	title: string;
	url: string;
	icon?: React.ElementType;
}

export interface ProjectNavItem {
	name: string;
	url: string;
	icon: React.ElementType;
}

export const configNav = {
	mainLink: "/",
	loginLink: "/auth/login",

	// Main navigation items
	mainNav: [
		{
			title: "Home",
			url: "/",
			icon: Home,
		},
		{
			title: "Timeline",
			url: "/timeline",
			icon: Calendar,
		},
		{
			title: "Members",
			url: "/members",
			icon: Users,
		},
	] as NavItem[],

	// Secondary navigation items
	secondaryNav: [
		{
			title: "Get Help",
			url: "#",
			icon: HelpCircle,
		},
	] as NavItem[],

	// Project navigation items
	projectNav: [
		{
			name: "Project 1",
			url: "#",
			icon: IconFolder,
		},
	] as ProjectNavItem[],
};

// Utility functions for navigation management
export const navUtils = {
	// Get navigation item by URL
	getNavItemByUrl: (url: string, navType: "main" | "secondary" | "project") => {
		switch (navType) {
			case "main":
				return configNav.mainNav.find((item) => item.url === url);
			case "secondary":
				return configNav.secondaryNav.find((item) => item.url === url);
			case "project":
				return configNav.projectNav.find((item) => item.url === url);
			default:
				return undefined;
		}
	},

	// Check if URL is active (exact match)
	isActiveUrl: (currentPath: string, targetUrl: string) => {
		return currentPath === targetUrl;
	},

	// Check if URL is active (starts with)
	isActiveUrlStartsWith: (currentPath: string, targetUrl: string) => {
		return currentPath.startsWith(targetUrl);
	},

	// Get all navigation items
	getAllNavItems: () => {
		return {
			main: configNav.mainNav,
			secondary: configNav.secondaryNav,
			projects: configNav.projectNav,
		};
	},

	// Add new navigation item
	addNavItem: (item: NavItem, navType: "main" | "secondary") => {
		switch (navType) {
			case "main":
				configNav.mainNav.push(item);
				break;
			case "secondary":
				configNav.secondaryNav.push(item);
				break;
		}
	},

	// Add new project item
	addProjectItem: (item: ProjectNavItem) => {
		configNav.projectNav.push(item);
	},
};

// Custom hook for navigation
export const useNavigation = () => {
	const pathname = usePathname();

	return {
		pathname,
		mainNav: configNav.mainNav,
		secondaryNav: configNav.secondaryNav,
		projectNav: configNav.projectNav,
		isActive: (url: string) => navUtils.isActiveUrl(pathname, url),
		isActiveStartsWith: (url: string) =>
			navUtils.isActiveUrlStartsWith(pathname, url),
		getNavItemByUrl: (url: string, navType: "main" | "secondary" | "project") =>
			navUtils.getNavItemByUrl(url, navType),
	};
};
