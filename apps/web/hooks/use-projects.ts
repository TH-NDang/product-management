"use client";

import { getApiUrl } from "@/lib/config";
import type { Project } from "@/lib/config";
import { useState } from "react";

interface CreateProjectData {
	name: string;
	description?: string;
}

interface UseProjectsOperations {
	createProject: (data: CreateProjectData) => Promise<Project | null>;
	deleteProject: (projectId: string) => Promise<boolean>;
	isCreating: boolean;
	isDeleting: boolean;
	error: string | null;
}

export function useProjectsOperations(): UseProjectsOperations {
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createProject = async (
		data: CreateProjectData,
	): Promise<Project | null> => {
		setIsCreating(true);
		setError(null);

		try {
			const response = await fetch(getApiUrl("/projects"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to create project: ${response.statusText}`);
			}

			const newProject = await response.json();
			return newProject;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create project";
			setError(errorMessage);
			return null;
		} finally {
			setIsCreating(false);
		}
	};

	const deleteProject = async (projectId: string): Promise<boolean> => {
		setIsDeleting(true);
		setError(null);

		try {
			const response = await fetch(getApiUrl(`/projects/${projectId}`), {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete project: ${response.statusText}`);
			}

			return true;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to delete project";
			setError(errorMessage);
			return false;
		} finally {
			setIsDeleting(false);
		}
	};

	return {
		createProject,
		deleteProject,
		isCreating,
		isDeleting,
		error,
	};
}
