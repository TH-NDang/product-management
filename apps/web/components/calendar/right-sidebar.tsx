"use client";

import { etiquettes } from "@/components/calendar/big-calendar";
import { useCalendarContext } from "@/components/calendar/calendar-context";
import SidebarCalendar from "@/components/calendar/sidebar-calendar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Check } from "lucide-react";
import * as React from "react";

export const TimelineSidebar = () => {
	const { isColorVisible, toggleColorVisibility } = useCalendarContext();
	return (
		<div className="flex h-full w-full flex-col gap-6 border-l bg-background px-4 py-6">
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
		</div>
	);
};
