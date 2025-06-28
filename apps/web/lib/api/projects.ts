import { getApiUrl } from "@/lib/config";
import type { Project } from "@/lib/config";

export interface CreateProjectData {
	name: string;
	description?: string;
}

export interface ProjectsResponse {
	data: Project[];
	total: number;
	hasMore: boolean;
}

// API functions
export const projectsApi = {
	// Get projects with pagination
	getProjects: async (offset = 0, limit = 20): Promise<Project[]> => {
		const url = new URL(getApiUrl("/projects"));
		url.searchParams.set("offset", offset.toString());
		url.searchParams.set("limit", limit.toString());

		const response = await fetch(url.toString());
		if (!response.ok) {
			throw new Error(`Failed to fetch projects: ${response.statusText}`);
		}

		return response.json();
	},

	// Get single project
	getProject: async (id: string): Promise<Project> => {
		const response = await fetch(getApiUrl(`/projects/${id}`));
		if (!response.ok) {
			throw new Error(`Failed to fetch project: ${response.statusText}`);
		}

		return response.json();
	},

	// Create project
	createProject: async (data: CreateProjectData): Promise<Project> => {
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

		return response.json();
	},

	// Update project
	updateProject: async (
		id: string,
		data: Partial<CreateProjectData>,
	): Promise<Project> => {
		const response = await fetch(getApiUrl(`/projects/${id}`), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Failed to update project: ${response.statusText}`);
		}

		return response.json();
	},

	// Delete project
	deleteProject: async (id: string): Promise<void> => {
		const response = await fetch(getApiUrl(`/projects/${id}`), {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error(`Failed to delete project: ${response.statusText}`);
		}
	},
};

// React Query keys
export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	list: (filters: { offset?: number; limit?: number }) =>
		[...projectKeys.lists(), filters] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
};
