'use client';

import { useSearchParams } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { useState } from 'react';
import ProjectHeader from "@/components/project/header";
import KanbanMain from "@/components/kanban/kanban-main";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useRouter } from 'next/navigation';
import type { RootState } from "@/lib/redux-store/store";
import { useSelector } from "react-redux";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { useProject } from '@/hooks/use-projects-query';
import { Loader2 } from 'lucide-react';

type Project = {
    id: string;
    name: string;
    description?: string;
    status?: string;
    // Add other project properties as needed
};

export default function ProjectPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [projectId, setProjectId] = useQueryState(
        'id',
        parseAsString.withDefault('')
    );
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const teamId = useSelector((state: RootState) => state.team.activeTeamId) || '';
    const userId = useSelector((state: RootState) => state.auth.userId) || '';
    const { data: project, isLoading, error } = useProject(teamId, projectId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading project...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                Error loading project: {error.message}
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No project selected</p>
            </div>
        );
    }

    // Handle task click - open edit dialog
    const handleTaskClick = (task: any) => {
        setSelectedTask(task);
        setIsEditDialogOpen(true);
    };

    // Handle successful task creation/update
    const handleTaskSuccess = () => {
        // The TaskList will automatically refetch tasks when the query is invalidated
        setSelectedTask(null);
    };

    // Update projectId when URL changes
    const id = searchParams.get('id');
    if (id && id !== projectId) {
        setProjectId(id);
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No project selected</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur">
                <ProjectHeader
                    projectName={project.name}
                    onAddTask={() => setIsCreateDialogOpen(true)}
                />
            </div>
            <div className="pt-4 flex-1">
                <KanbanMain
                    projectId={project.id}
                    onTaskClick={(task) => {
                        setSelectedTask(task);
                        setIsEditDialogOpen(true);
                    }}
                />
            </div>

            <TaskDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                projectId={projectId}
                userId={userId}
                onSuccess={handleTaskSuccess}
            />

            {/* Edit Task Dialog */}
            {selectedTask && (
                <TaskDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    projectId={projectId}
                    userId={userId}
                    task={selectedTask}
                    onSuccess={handleTaskSuccess}
                />
            )}
        </ScrollArea>
    );
}