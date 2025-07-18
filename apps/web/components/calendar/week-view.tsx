"use client";

import {
	addHours,
	areIntervalsOverlapping,
	differenceInMinutes,
	eachDayOfInterval,
	eachHourOfInterval,
	endOfWeek,
	format,
	getHours,
	getMinutes,
	isBefore,
	isSameDay,
	isToday,
	startOfDay,
	startOfWeek,
} from "date-fns";
import type React from "react";
import { useMemo } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { EndHour, StartHour, WeekCellsHeight } from "./constants";
import { DraggableEvent } from "./draggable-event";
import { DroppableCell } from "./droppable-cell";
import { EventItem } from "./event-item";
import type { CalendarEvent } from "./types";
import { useCurrentTimeIndicator } from "./use-current-time-indicator";
import { isMultiDayEvent } from "./utils";

interface WeekViewProps {
	currentDate: Date;
	events: CalendarEvent[];
	onEventSelect: (event: CalendarEvent) => void;
	onEventCreate: (startTime: Date) => void;
}

interface PositionedEvent {
	event: CalendarEvent;
	top: number;
	height: number;
	left: number;
	width: number;
	zIndex: number;
}

export function WeekView({
	currentDate,
	events,
	onEventSelect,
	onEventCreate,
}: WeekViewProps) {
	const days = useMemo(() => {
		const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
		const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
		return eachDayOfInterval({ start: weekStart, end: weekEnd });
	}, [currentDate]);

	const weekStart = useMemo(
		() => startOfWeek(currentDate, { weekStartsOn: 0 }),
		[currentDate],
	);

	const hours = useMemo(() => {
		const dayStart = startOfDay(currentDate);
		return eachHourOfInterval({
			start: addHours(dayStart, StartHour),
			end: addHours(dayStart, EndHour - 1),
		});
	}, [currentDate]);

	// Get all-day events and multi-day events for the week
	const allDayEvents = useMemo(() => {
		return events
			.filter((event) => {
				// Include explicitly marked all-day events or multi-day events
				return event.allDay || isMultiDayEvent(event);
			})
			.filter((event) => {
				const eventStart = new Date(event.start);
				const eventEnd = new Date(event.end);
				return days.some(
					(day) =>
						isSameDay(day, eventStart) ||
						isSameDay(day, eventEnd) ||
						(day > eventStart && day < eventEnd),
				);
			});
	}, [events, days]);

	// Process events for each day to calculate positions
	const processedDayEvents = useMemo(() => {
		const result = days.map((day) => {
			// Get events for this day that are not all-day events or multi-day events
			const dayEvents = events.filter((event) => {
				// Skip all-day events and multi-day events
				if (event.allDay || isMultiDayEvent(event)) return false;

				const eventStart = new Date(event.start);
				const eventEnd = new Date(event.end);

				// Check if event is on this day
				return (
					isSameDay(day, eventStart) ||
					isSameDay(day, eventEnd) ||
					(eventStart < day && eventEnd > day)
				);
			});

			// Sort events by start time and duration
			const sortedEvents = [...dayEvents].sort((a, b) => {
				const aStart = new Date(a.start);
				const bStart = new Date(b.start);
				const aEnd = new Date(a.end);
				const bEnd = new Date(b.end);

				// First sort by start time
				if (aStart < bStart) return -1;
				if (aStart > bStart) return 1;

				// If start times are equal, sort by duration (longer events first)
				const aDuration = differenceInMinutes(aEnd, aStart);
				const bDuration = differenceInMinutes(bEnd, bStart);
				return bDuration - aDuration;
			});

			// Calculate positions for each event
			const positionedEvents: PositionedEvent[] = [];
			const dayStart = startOfDay(day); // Track columns for overlapping events
			const columns: { event: CalendarEvent; end: Date }[][] = [];

			for (const event of sortedEvents) {
				const eventStart = new Date(event.start);
				const eventEnd = new Date(event.end);

				// Adjust start and end times if they're outside this day
				const adjustedStart = isSameDay(day, eventStart)
					? eventStart
					: dayStart;
				const adjustedEnd = isSameDay(day, eventEnd)
					? eventEnd
					: addHours(dayStart, 24);

				// Calculate top position and height
				const startHour =
					getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
				const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

				// Adjust the top calculation to account for the new start time
				const top = (startHour - StartHour) * WeekCellsHeight;
				const height = (endHour - startHour) * WeekCellsHeight;

				// Find a column for this event
				let columnIndex = 0;
				let placed = false;

				while (!placed) {
					const col = columns[columnIndex] || [];
					if (col.length === 0) {
						columns[columnIndex] = col;
						placed = true;
					} else {
						const overlaps = col.some((c) =>
							areIntervalsOverlapping(
								{ start: adjustedStart, end: adjustedEnd },
								{
									start: new Date(c.event.start),
									end: new Date(c.event.end),
								},
							),
						);
						if (!overlaps) {
							placed = true;
						} else {
							columnIndex++;
						}
					}
				}

				// Ensure column is initialized before pushing
				const currentColumn = columns[columnIndex] || [];
				columns[columnIndex] = currentColumn;
				currentColumn.push({ event, end: adjustedEnd });

				// Calculate width and left position based on number of columns
				const width = columnIndex === 0 ? 1 : 0.9;
				const left = columnIndex === 0 ? 0 : columnIndex * 0.1;
				positionedEvents.push({
					event,
					top,
					height,
					left,
					width,
					zIndex: 10 + columnIndex, // Higher columns get higher z-index
				});
			}

			return positionedEvents;
		});

		return result;
	}, [days, events]);

	const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
		e.stopPropagation();
		onEventSelect(event);
	};

	const showAllDaySection = allDayEvents.length > 0;
	const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
		currentDate,
		"week",
	);

	return (
		<div data-slot="week-view" className="flex h-full flex-col">
			<div className="sticky top-0 z-30 grid grid-cols-8 border-border/70 border-y bg-background/80 uppercase backdrop-blur-md">
				<div className="py-2 text-center text-muted-foreground/70 text-xs">
					<span className="max-[479px]:sr-only">{format(new Date(), "O")}</span>
				</div>
				{days.map((day) => (
					<div
						key={day.toString()}
						className="py-2 text-center text-muted-foreground/70 text-xs data-today:font-medium data-today:text-foreground"
						data-today={isToday(day) || undefined}
					>
						<span className="sm:hidden" aria-hidden="true">
							{format(day, "E")[0]} {format(day, "d")}
						</span>
						<span className="max-sm:hidden">{format(day, "EEE dd")}</span>
					</div>
				))}
			</div>

			{showAllDaySection && (
				<div className="border-border/70 border-b bg-muted/50">
					<div className="grid grid-cols-8">
						<div className="relative border-border/70 border-r">
							<span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
								All day
							</span>
						</div>
						{days.map((day, dayIndex) => {
							const dayAllDayEvents = allDayEvents.filter((event) => {
								const eventStart = new Date(event.start);
								const eventEnd = new Date(event.end);
								return (
									isSameDay(day, eventStart) ||
									(day > eventStart && day < eventEnd) ||
									isSameDay(day, eventEnd)
								);
							});

							return (
								<div
									key={day.toString()}
									className="relative border-border/70 border-r p-1 last:border-r-0"
									data-today={isToday(day) || undefined}
								>
									{dayAllDayEvents.map((event) => {
										const eventStart = new Date(event.start);
										const eventEnd = new Date(event.end);
										const isFirstDay = isSameDay(day, eventStart);
										const isLastDay = isSameDay(day, eventEnd);

										// Check if this is the first day in the current week view
										const isFirstVisibleDay =
											dayIndex === 0 && isBefore(eventStart, weekStart);
										const shouldShowTitle = isFirstDay || isFirstVisibleDay;

										return (
											<EventItem
												key={`spanning-${event.id}`}
												onClick={(e) => handleEventClick(event, e)}
												event={event}
												view="month"
												isFirstDay={isFirstDay}
												isLastDay={isLastDay}
											>
												{/* Show title if it's the first day of the event or the first visible day in the week */}
												<div
													className={cn(
														"truncate",
														!shouldShowTitle && "invisible",
													)}
													aria-hidden={!shouldShowTitle}
												>
													{event.title}
												</div>
											</EventItem>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className="grid flex-1 grid-cols-8 overflow-hidden">
				<div className="grid auto-cols-fr border-border/70 border-r">
					{hours.map((hour, index) => (
						<div
							key={hour.toString()}
							className="relative min-h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
						>
							{index > 0 && (
								<span className="-top-3 absolute left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
									{format(hour, "h a")}
								</span>
							)}
						</div>
					))}
				</div>

				{days.map((day, dayIndex) => (
					<div
						key={day.toString()}
						className="relative grid auto-cols-fr border-border/70 border-r last:border-r-0"
						data-today={isToday(day) || undefined}
					>
						{/* Positioned events */}
						{(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
							<div
								key={positionedEvent.event.id}
								className="absolute z-10 px-0.5"
								style={{
									top: `${positionedEvent.top}px`,
									height: `${positionedEvent.height}px`,
									left: `${positionedEvent.left * 100}%`,
									width: `${positionedEvent.width * 100}%`,
									zIndex: positionedEvent.zIndex,
								}}
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
									}
								}}
							>
								<button
									className="h-full w-full text-left"
									onClick={(e) => handleEventClick(positionedEvent.event, e)}
									type="button"
								>
									<div className="h-full w-full">
										{" "}
										<DraggableEvent
											event={positionedEvent.event}
											view="week"
											onClick={(e) =>
												handleEventClick(positionedEvent.event, e)
											}
											showTime
											height={positionedEvent.height}
										/>
									</div>
								</button>
							</div>
						))}

						{/* Current time indicator - only show for today's column */}
						{currentTimeVisible && isToday(day) && (
							<div
								className="pointer-events-none absolute right-0 left-0 z-20"
								style={{ top: `${currentTimePosition}%` }}
							>
								{" "}
								<div className="relative flex items-center">
									<div className="-left-1 absolute h-2 w-2 rounded-full bg-red-500" />
									<div className="h-[2px] w-full bg-red-500" />
								</div>
							</div>
						)}
						{hours.map((hour) => {
							const hourValue = getHours(hour);
							return (
								<div
									key={hour.toString()}
									className="relative min-h-[var(--week-cells-height)] border-border/70 border-b last:border-b-0"
								>
									{/* Quarter-hour intervals */}
									{[0, 1, 2, 3].map((quarter) => {
										const quarterHourTime = hourValue + quarter * 0.25;
										return (
											<DroppableCell
												key={`${hour.toString()}-${quarter}`}
												id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
												date={day}
												time={quarterHourTime}
												className={cn(
													"absolute h-[calc(var(--week-cells-height)/4)] w-full",
													quarter === 0 && "top-0",
													quarter === 1 &&
														"top-[calc(var(--week-cells-height)/4)]",
													quarter === 2 &&
														"top-[calc(var(--week-cells-height)/4*2)]",
													quarter === 3 &&
														"top-[calc(var(--week-cells-height)/4*3)]",
												)}
												onClick={() => {
													const startTime = new Date(day);
													startTime.setHours(hourValue);
													startTime.setMinutes(quarter * 15);
													onEventCreate(startTime);
												}}
											/>
										);
									})}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
