"use client";

import BigCalendar from "@/components/calendar/big-calendar";
import GanttExample from "@/components/gantt/example";
import KanbanExample from "@/components/kanban/example";
import { useTimelineContext } from "./layout";

export default function Page() {
	const { tab } = useTimelineContext();

	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-2 pt-0">
			{tab === "calendar" && <BigCalendar />}
			{tab === "gantt" && (
				<div className="h-full min-h-[600px] w-full">
					<GanttExample />
				</div>
			)}
			{tab === "kanban" && (
				<div className="h-full min-h-[600px] w-full">
					<KanbanExample />
				</div>
			)}
		</div>
	);
}
