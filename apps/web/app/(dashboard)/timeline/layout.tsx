"use client";

import { CalendarProvider } from "@/components/calendar/calendar-context";
import { TimelineSidebar } from "@/components/calendar/right-sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { BarChart3Icon, CalendarIcon, KanbanIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import type * as React from "react";

type TimelineContextType = {
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	tab: string;
	setTab: (tab: string) => void;
};

const TimelineContext = createContext<TimelineContextType>({
	showSidebar: true,
	setShowSidebar: () => {},
	tab: "calendar",
	setTab: () => {},
});

export const useTimelineContext = () => useContext(TimelineContext);

export default function TimelineLayout({
	children,
}: { children: React.ReactNode }) {
	const [showSidebar, setShowSidebar] = useState(true);
	const [tab, setTab] = useState("calendar");

	// Ẩn/hiện sidebar theo tab
	const handleTabChange = (value: string) => {
		setTab(value);
		setShowSidebar(value === "calendar");
	};

	return (
		<TimelineContext.Provider
			value={{ showSidebar, setShowSidebar, tab, setTab }}
		>
			<CalendarProvider>
				<Tabs
					value={tab}
					onValueChange={handleTabChange}
					className="flex flex-1 flex-col"
				>
					<div className="sticky top-0 z-10 mb-2 rounded-lg bg-background/80 backdrop-blur">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="calendar" className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								Calendar
							</TabsTrigger>
							<TabsTrigger value="gantt" className="flex items-center gap-2">
								<BarChart3Icon className="h-4 w-4" />
								Gantt
							</TabsTrigger>
							<TabsTrigger value="kanban" className="flex items-center gap-2">
								<KanbanIcon className="h-4 w-4" />
								Kanban
							</TabsTrigger>
						</TabsList>
					</div>
					<ResizablePanelGroup direction="horizontal" className="h-full w-full">
						<ResizablePanel
							minSize={30}
							defaultSize={showSidebar ? 70 : 100}
							className="h-full"
						>
							<ScrollArea className="h-full">
								<div className="w-full p-4">{children}</div>
							</ScrollArea>
						</ResizablePanel>
						{showSidebar && (
							<>
								<ResizableHandle withHandle />
								<ResizablePanel
									minSize={20}
									defaultSize={30}
									maxSize={40}
									className="h-full min-w-[260px] max-w-[400px]"
								>
									<ScrollArea className="h-full">
										<TimelineSidebar />
									</ScrollArea>
								</ResizablePanel>
							</>
						)}
					</ResizablePanelGroup>
				</Tabs>
			</CalendarProvider>
		</TimelineContext.Provider>
	);
}
