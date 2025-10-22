import {
  HistoryIcon,
  MessageSquareText,
  Plus,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";

interface ProjectHeaderProps {
  projectName: string;
  onAddTask?: () => void;
}

export default function ProjectHeader({ projectName, onAddTask }: ProjectHeaderProps) {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium">{projectName || 'Loading...'}</h1>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {onAddTask && (
            <Button onClick={onAddTask} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* History button */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="History"
          >
            <HistoryIcon size={16} aria-hidden="true" />
          </Button>
          {/* Comments button */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="Save"
          >
            <MessageSquareText size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
