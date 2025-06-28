import type { Project } from "@/lib/config";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Base selectors
export const selectProjectsState = (state: RootState) => state.projects;

export const selectAllProjects = (state: RootState) => state.projects.projects;
export const selectSelectedProjectId = (state: RootState) =>
	state.projects.selectedProjectId;
export const selectProjectsLoading = (state: RootState) =>
	state.projects.isLoading;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectsFilters = (state: RootState) =>
	state.projects.filters;

// Derived selectors
export const selectSelectedProject = createSelector(
	[selectAllProjects, selectSelectedProjectId],
	(projects, selectedId) => {
		if (!selectedId) return null;
		return projects.find((project) => project.id === selectedId) || null;
	},
);

export const selectFilteredProjects = createSelector(
	[selectAllProjects, selectProjectsFilters],
	(projects, filters) => {
		let filtered = [...projects];

		// Filter by search term
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(project) =>
					project.name.toLowerCase().includes(searchLower) ||
					project.description?.toLowerCase().includes(searchLower),
			);
		}

		// Filter by status
		if (filters.status) {
			filtered = filtered.filter(
				(project) => project.status === filters.status,
			);
		}

		return filtered;
	},
);

export const selectProjectsByStatus = createSelector(
	[selectAllProjects],
	(projects) => {
		const statusGroups = projects.reduce(
			(acc, project) => {
				const status = project.status;
				if (!acc[status]) {
					acc[status] = [];
				}
				acc[status].push(project);
				return acc;
			},
			{} as Record<string, Project[]>,
		);

		return statusGroups;
	},
);

export const selectProjectsStats = createSelector(
	[selectAllProjects],
	(projects) => {
		const total = projects.length;
		const active = projects.filter((p) => p.status === "active").length;
		const completed = projects.filter((p) => p.status === "completed").length;
		const planning = projects.filter((p) => p.status === "planning").length;

		return {
			total,
			active,
			completed,
			planning,
		};
	},
);

// Memoized selectors for performance
export const selectProjectById = createSelector(
	[selectAllProjects, (_state: RootState, id: string) => id],
	(projects, id) => projects.find((project) => project.id === id) || null,
);

export const selectProjectsCount = createSelector(
	[selectAllProjects],
	(projects) => projects.length,
);
