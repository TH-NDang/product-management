"use client";

import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import { useCalendarContext } from "./calendar-context";

interface SidebarCalendarProps {
	className?: string;
}

export default function SidebarCalendar({ className }: SidebarCalendarProps) {
	// Use the shared calendar context
	const { currentDate, setCurrentDate } = useCalendarContext();

	// Track the month to display in the calendar
	const [calendarMonth, setCalendarMonth] = useState<Date>(currentDate);

	// Update the calendar month whenever currentDate changes
	useEffect(() => {
		setCalendarMonth(currentDate);
	}, [currentDate]);

	// Handle date selection
	const handleSelect = (date: Date | undefined) => {
		if (date) {
			setCurrentDate(date);
		}
	};

	return (
		<div className={cn("flex w-full justify-center", className)}>
			<Calendar
				mode="single"
				selected={currentDate}
				onSelect={handleSelect}
				month={calendarMonth}
				onMonthChange={setCalendarMonth}
				className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
			/>
		</div>
	);
}
