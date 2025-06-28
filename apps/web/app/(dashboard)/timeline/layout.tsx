"use client";

import { CalendarProvider } from "@/components/calendar/calendar-context";
import { TimelineSidebar } from "@/components/calendar/right-sidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import type * as React from "react";

export default function TimelineLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<CalendarProvider>
			<ResizablePanelGroup direction="horizontal" className="h-full w-full">
				<ResizablePanel minSize={30} defaultSize={70} className="h-full">
					<ScrollArea className="h-full">
						<div className="w-full p-4">{children}</div>
					</ScrollArea>
				</ResizablePanel>
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
			</ResizablePanelGroup>
		</CalendarProvider>
	);
}
