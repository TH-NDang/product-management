"use client";

import { useCreateProject } from "@/hooks/use-projects-query";
import type { CreateProjectData } from "@/lib/api/projects";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddProjectModalProps {
	teamId: string;
	onProjectCreated?: () => void;
}

export function AddProjectModal({
	teamId,
	onProjectCreated,
}: AddProjectModalProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [endDate, setEndDate] = useState("");
	const createMutation = useCreateProject(teamId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Project name is required");
			return;
		}

		try {
			await createMutation.mutateAsync({
				name: name.trim(),
				...(startDate && { startDate: new Date(startDate).toISOString() }),
				...(description && { description }),
				...(endDate && { endDate: new Date(endDate).toISOString() }),
			});

			setOpen(false);
			setName("");
			setDescription("");
			setStartDate(new Date().toISOString().split("T")[0]);
			setEndDate("");
			onProjectCreated?.();
		} catch (error) {
			toast.error("Failed to create project");
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setOpen(false);
			// Reset form only when closing
			if (!createMutation.isPending) {
				setName("");
				setDescription("");
				setStartDate(new Date().toISOString().split("T")[0]);
				setEndDate("");
			}
		} else {
			setOpen(true);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<div className="flex h-8 w-8 items-center justify-center">
					<Plus className="h-4 w-4" />
					<span className="sr-only">Add Project</span>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
					<DialogDescription>
						Add a new project to your workspace. Fill in the details below.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name *
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter project name"
								className="col-span-3"
								disabled={createMutation.isPending}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="description" className="text-right">
								Description
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter project description (optional)"
								className="col-span-3"
								disabled={createMutation.isPending}
								rows={3}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="startDate" className="text-right">
								Start Date
							</Label>
							<Input
								id="startDate"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="col-span-3"
								disabled={createMutation.isPending}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="endDate" className="text-right">
								End Date
							</Label>
							<Input
								id="endDate"
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="col-span-3"
								disabled={createMutation.isPending}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={createMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createMutation.isPending || !name.trim()}
						>
							{createMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Project"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
