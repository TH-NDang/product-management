import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface TimelineTab {
	value: string;
	label: string;
	icon: LucideIcon;
	content: React.ReactNode;
	badge?: string | number;
}

export function TimelineTabs({ tabs = [] }: { tabs: TimelineTab[] }) {
	if (tabs.length === 0) {
		return null;
	}
	const firstTab = tabs[0];

	return (
		<Tabs
			defaultValue={firstTab?.value}
			className="flex h-full flex-col overflow-hidden"
		>
			<div className="sticky top-0 z-10 bg-background/80 backdrop-blur">
				<ScrollArea className="w-full">
					<TabsList className="h-auto w-max gap-2 rounded-none border-b bg-transparent px-4 py-1">
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className={cn(
									"group relative h-auto px-3 py-2 font-medium text-muted-foreground text-sm",
									"hover:text-foreground data-[state=active]:text-foreground",
									"relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-transparent after:transition-transform after:duration-200 after:content-[''] data-[state=active]:after:bg-primary",
									"data-[state=active]:after:scale-x-100",
								)}
							>
								<tab.icon className="mr-2 h-4 w-4" aria-hidden="true" />
								{tab.label}
								{tab.badge && (
									<Badge
										className="ml-2 bg-primary/10 text-primary"
										variant="secondary"
									>
										{tab.badge}
									</Badge>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>

			<div className="flex-1 overflow-hidden">
				<ScrollArea className="h-full w-full">
					<div className="p-4">
						{tabs.map((tab) => (
							<TabsContent key={tab.value} value={tab.value} className="m-0">
								{tab.content}
							</TabsContent>
						))}
					</div>
				</ScrollArea>
			</div>
		</Tabs>
	);
}
