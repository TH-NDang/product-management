"use client";

import { useCallback } from "react";
// Using type assertion to avoid import issues
import { useAppSelector } from "@/lib/redux-store/hooks";
import type { RootState } from "@/lib/redux-store/store";
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/components/kanban";
import { Task } from "@/lib/api/tasks";
import { useTasks, useUpdateTaskStatus } from "@/hooks/use-tasks";
import { Card } from "@workspace/ui/components/card";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface KanbanColumn {
	id: string;
	name: string;
	color: string;
	[key: string]: unknown; // Add index signature to match KanbanColumnProps
}

interface KanbanItemType {
	id: string;
	name: string;
	column: string;
	task: Task; // Store the full task data
}

const columns: KanbanColumn[] = [
	{ id: "TODO", name: "To Do", color: "#6B7280" },
	{ id: "IN_PROGRESS", name: "In Progress", color: "#F59E0B" },
	{ id: "DONE", name: "Done", color: "#10B981" },
];

interface KanbanExampleProps {
	projectId: string;
	onTaskClick?: (task: Task) => void;
}

const KanbanMain = ({ projectId, onTaskClick }: KanbanExampleProps) => {
	// Get user ID from Redux store
	const { userId } = useAppSelector((state: RootState) => state.auth);
	const queryClient = useQueryClient();

	const { data: tasks = [], isLoading, error } = useTasks(projectId, userId || '');
	const updateTaskStatus = useUpdateTaskStatus();

	// Handle drag end to update task status
	const handleDragEnd = useCallback(
		(event: any) => {
			const { active, over } = event;
			if (!active || !over) return;

			const taskId = active.id;
			const newStatus = over.id as 'TODO' | 'IN_PROGRESS' | 'DONE';

			// Find the task being moved
			const task = tasks.find((t) => t.id === taskId);
			if (!task || task.status === newStatus) return;

			// Optimistically update the UI
			queryClient.setQueryData(
				['tasks', projectId, userId],
				(oldTasks: Task[] = []) =>
					oldTasks.map((t) =>
						t.id === taskId ? { ...t, status: newStatus } : t
					)
			);

			// Update the task status in the backend
			updateTaskStatus.mutate({
				taskId,
				status: newStatus,
				userId: userId || '',
			});
		},
		[projectId, tasks, updateTaskStatus, userId, queryClient]
	);

	// Map tasks to KanbanItemType format
	const kanbanItems: KanbanItemType[] = tasks.map(task => ({
		id: task.id,
		name: task.title,
		column: task.status,
		task // Store the full task data for access in the card
	}));

	// Group items by status
	const itemsByStatus = kanbanItems.reduce<Record<string, KanbanItemType[]>>(
		(acc, item) => {
			const column = item.column as keyof typeof acc;
			if (!acc[column]) {
				acc[column] = [];
			}
			(acc[column] as KanbanItemType[]).push(item);
			return acc;
		},
		{ TODO: [], IN_PROGRESS: [], DONE: [] } as const
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				<span className="ml-2">Loading tasks...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-red-500">
				Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
			</div>
		);
	}

	if (!userId) {
		return (
			<div className="p-4 text-center text-muted-foreground">
				Please sign in to view tasks
			</div>
		);
	}

	return (
		<div className="h-full w-full px-4">
			<KanbanProvider
				columns={columns}
				data={kanbanItems as any[]}
				onDataChange={() => { }}
				onDragEnd={handleDragEnd}
				className="h-full"
			>
				{(column: KanbanColumn) => (
					<KanbanBoard
						id={column.id}
						key={column.id}
						className="mx-2 rounded-lg bg-muted p-4 shadow"
					>
						<KanbanHeader className="mb-2 text-foreground/90">
							<div className="flex items-center gap-2">
								<div
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: column.color as string }}
								/>
								<span>{column.name}</span>
								<span className="ml-auto text-sm text-muted-foreground">
									{itemsByStatus[column.id]?.length || 0}
								</span>
							</div>
						</KanbanHeader>
						<KanbanCards id={column.id}>
							{(item) => {
								const task = kanbanItems.find(i => i.id === item.id)?.task;
								if (!task) return null;

								return (
									<KanbanCard
										key={item.id}
										id={item.id}
										name={item.name}
										column={item.column}
										onClick={() => onTaskClick?.(task)}
										className="mb-2 rounded-md border border-muted bg-background p-3 shadow"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex flex-col gap-1">
												<h3 className="font-medium text-sm line-clamp-2">
													{task.title}
												</h3>
												<div className="mt-1">
													<p className="text-xs text-muted-foreground line-clamp-2">
														{task.description || 'No description'}
													</p>
												</div>
												<div className="flex justify-between items-center mt-2">
													<span className="text-xs text-muted-foreground">
														Due: {new Date(task.dueDate).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
									</KanbanCard>
								);
							}}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>
		</div>
	);
};

export default KanbanMain;
