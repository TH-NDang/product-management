"use client";

import { CalendarMain } from "@/components/calendar/calendar-main";
import GanttExample from "@/components/gantt/example";
import KanbanExample from "@/components/kanban/kanban-main";
import { TimelineTabs } from "@/components/timeline/timeline-tabs";
import { BoxIcon, CalendarIcon, ChartLine } from "lucide-react";

const tabs = [
	{
		value: "calendar",
		label: "Calendar",
		icon: CalendarIcon,
		content: <CalendarMain />,
	},
	{
		value: "gantt",
		label: "Gantt",
		icon: ChartLine,
		content: <GanttExample />,
	},
];

export default function Page() {
	return <TimelineTabs tabs={tabs} />;
}
