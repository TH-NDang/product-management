"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@workspace/ui/components/popover";

const initialNotifications = [
	{
		id: 1,
		user: "Chris Tompson",
		action: "requested review on",
		target: "PR #42: Feature implementation",
		timestamp: "15 minutes ago",
		unread: true,
	},
	{
		id: 2,
		user: "Emma Davis",
		action: "shared",
		target: "New component library",
		timestamp: "45 minutes ago",
		unread: true,
	},
	{
		id: 3,
		user: "James Wilson",
		action: "assigned you to",
		target: "API integration task",
		timestamp: "4 hours ago",
		unread: false,
	},
	{
		id: 4,
		user: "Alex Morgan",
		action: "replied to your comment in",
		target: "Authentication flow",
		timestamp: "12 hours ago",
		unread: false,
	},
	{
		id: 5,
		user: "Sarah Chen",
		action: "commented on",
		target: "Dashboard redesign",
		timestamp: "2 days ago",
		unread: false,
	},
	{
		id: 6,
		user: "Miky Derya",
		action: "mentioned you in",
		target: "Origin UI open graph image",
		timestamp: "2 weeks ago",
		unread: false,
	},
];

function Dot({ className }: { className?: string }) {
	return (
		<svg
			width="6"
			height="6"
			fill="currentColor"
			viewBox="0 0 6 6"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<circle cx="3" cy="3" r="3" />
		</svg>
	);
}

export default function NotificationMenu() {
	const [notifications, setNotifications] = useState(initialNotifications);
	const unreadCount = notifications.filter((n) => n.unread).length;

	const handleMarkAllAsRead = () => {
		setNotifications(
			notifications.map((notification) => ({
				...notification,
				unread: false,
			})),
		);
	};

	const handleNotificationClick = (id: number) => {
		setNotifications(
			notifications.map((notification) =>
				notification.id === id
					? { ...notification, unread: false }
					: notification,
			),
		);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="relative size-8 rounded-full text-muted-foreground shadow-none"
					aria-label="Open notifications"
				>
					<BellIcon size={16} aria-hidden="true" />
					{unreadCount > 0 && (
						<div
							aria-hidden="true"
							className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-1">
				<div className="flex items-baseline justify-between gap-4 px-3 py-2">
					<div className="font-semibold text-sm">Notifications</div>
					{unreadCount > 0 && (
						<button
							type="button"
							className="font-medium text-xs hover:underline"
							onClick={handleMarkAllAsRead}
						>
							Mark all as read
						</button>
					)}
				</div>
				<hr
					aria-orientation="horizontal"
					className="-mx-1 my-1 h-px bg-border"
					tabIndex={0}
				/>
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
					>
						<div className="relative flex items-start pe-3">
							<div className="flex-1 space-y-1">
								<button
									type="button"
									className="text-left text-foreground/80 after:absolute after:inset-0"
									onClick={() => handleNotificationClick(notification.id)}
								>
									<span className="font-medium text-foreground hover:underline">
										{notification.user}
									</span>{" "}
									{notification.action}{" "}
									<span className="font-medium text-foreground hover:underline">
										{notification.target}
									</span>
									.
								</button>
								<div className="text-muted-foreground text-xs">
									{notification.timestamp}
								</div>
							</div>
							{notification.unread && (
								<div className="absolute end-0 self-center">
									<span className="sr-only">Unread</span>
									<Dot />
								</div>
							)}
						</div>
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
}
