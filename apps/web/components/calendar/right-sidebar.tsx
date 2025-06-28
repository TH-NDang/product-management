"use client";

import { etiquettes } from "@/components/calendar/big-calendar";
import { useCalendarContext } from "@/components/calendar/calendar-context";
import SidebarCalendar from "@/components/calendar/sidebar-calendar";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Check } from "lucide-react";
import * as React from "react";

const user = {
	name: "Sofia Safier",
	email: "sofia@safier.com",
	avatar:
		"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp6/user-01_l4if9t.png",
};

export const TimelineSidebar = () => {
	const { isColorVisible, toggleColorVisibility } = useCalendarContext();
	return (
		<div className="flex h-full w-full flex-col gap-6 border-l bg-background px-4 py-6">
			{/* Logo */}
			<div className="mb-2 flex items-center justify-between">
				<a className="inline-flex" href="/">
					{" "}
					<span className="sr-only">Logo</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 32 32"
						aria-labelledby="logoTitle"
					>
						<title id="logoTitle">Calendar Logo</title>
						<path
							fill="#52525C"
							d="m10.661.863-2.339 1.04 5.251 11.794L1.521 9.072l-.918 2.39 12.053 4.627-11.794 5.25 1.041 2.34 11.794-5.252L9.071 30.48l2.39.917 4.626-12.052 5.251 11.793 2.339-1.04-5.251-11.795 12.052 4.627.917-2.39-12.052-4.627 11.794-5.25-1.041-2.34-11.794 5.252L22.928 1.52l-2.39-.917-4.626 12.052L10.662.863Z"
						/>
						<path
							fill="#F4F4F5"
							d="M17.28 0h-2.56v12.91L5.591 3.78l-1.81 1.81 9.129 9.129H0v2.56h12.91L3.78 26.409l1.81 1.81 9.129-9.129V32h2.56V19.09l9.128 9.129 1.81-1.81-9.128-9.129H32v-2.56H19.09l9.129-9.129-1.81-1.81-9.129 9.129V0Z"
						/>
					</svg>
				</a>
			</div>
			{/* Calendar */}
			<SidebarCalendar />
			{/* Calendars List */}
			<div className="mt-4">
				<div className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Calendars
				</div>
				<ul className="flex flex-col gap-2">
					{etiquettes.map((item) => (
						<li key={item.id} className="flex items-center gap-2">
							<Checkbox
								id={item.id}
								className="peer sr-only"
								checked={isColorVisible(item.color)}
								onCheckedChange={() => toggleColorVisibility(item.color)}
							/>
							<Check
								className={`size-4 ${!isColorVisible(item.color) ? "invisible" : ""}`}
								aria-hidden="true"
							/>
							<label
								htmlFor={item.id}
								className={`cursor-pointer select-none ${!isColorVisible(item.color) ? "text-muted-foreground/65 line-through" : ""}`}
							>
								{item.name}
							</label>{" "}
							<span
								className="ml-auto size-2 rounded-full"
								style={{ backgroundColor: `var(--color-${item.color}-400)` }}
							/>
						</li>
					))}
				</ul>
			</div>
			{/* User Info */}
			<div className="mt-auto flex items-center gap-3 border-t pt-4">
				<Avatar>
					<AvatarImage src={user.avatar} alt={user.name} />
					<AvatarFallback>{user.name[0]}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-medium text-sm leading-tight">{user.name}</span>
					<span className="text-muted-foreground text-xs">{user.email}</span>
				</div>
			</div>
		</div>
	);
};
