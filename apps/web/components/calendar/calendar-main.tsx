import BigCalendar from "@/components/calendar/big-calendar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { CalendarProvider } from "./calendar-context";
import { TimelineSidebar } from "./right-sidebar";

export function CalendarMain() {
	return (
		<CalendarProvider>
			<ResizablePanelGroup direction="horizontal" className="h-full w-full">
				<ResizablePanel minSize={30} defaultSize={100} className="h-full">
					<ScrollArea className="h-full">
						<BigCalendar />
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
