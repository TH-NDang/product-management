import type { Project } from "@/lib/config";
import { api } from "./client";

export interface CreateProjectData {
	name: string;
	description?: string;
	startDate?: string; // ISO 8601 format
	endDate?: string; // ISO 8601 format
}

export interface ProjectsResponse {
	data: Project[];
	total: number;
	hasMore: boolean;
}

export const projectsApi = {
	getProjects: async (teamId: string): Promise<Project[]> => {
		if (!teamId) return [];
		const response = await api.get(`/api/project/teams/${teamId}/projects`);
		return response.data || [];
	},

	getProject: async (id: string): Promise<Project> => {
		const response = await api.get(`/api/project/teams/${id}`);
		return response.data;
	},

	createProject: async (
		teamId: string,
		projectData: CreateProjectData,
	): Promise<Project> => {
		const response = await api.post(
			`/api/project/teams/${teamId}/projects`,
			projectData,
		);
		return response.data;
	},

	updateProject: async ({
		teamId,
		projectId,
		data,
	}: {
		teamId: string;
		projectId: string;
		data: Partial<CreateProjectData>;
	}): Promise<Project> => {
		const response = await api.patch(
			`/api/project/teams/${teamId}/projects/${projectId}`,
			data,
		);
		return response.data;
	},

	deleteProject: async (teamId: string, projectId: string): Promise<void> => {
		await api.delete(`/api/project/teams/${teamId}/projects/${projectId}`);
	},
};

export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	listByTeam: (teamId: string) => [...projectKeys.lists(), { teamId }] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
};
