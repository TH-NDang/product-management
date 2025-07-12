import type { Project } from "@/lib/config";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ProjectsState {
	projects: Project[];
	selectedProjectId: string | null;
	isLoading: boolean;
	error: string | null;
	filters: {
		status: string;
		search: string;
	};
}

const initialState: ProjectsState = {
	projects: [],
	selectedProjectId: null,
	isLoading: false,
	error: null,
	filters: {
		status: "",
		search: "",
	},
};

const projectsSlice = createSlice({
	name: "projects",
	initialState,
	reducers: {
		setProjects: (state, action: PayloadAction<Project[]>) => {
			state.projects = action.payload;
		},
		addProject: (state, action: PayloadAction<Project>) => {
			state.projects.unshift(action.payload);
		},
		updateProject: (state, action: PayloadAction<Project>) => {
			const index = state.projects.findIndex((p) => p.id === action.payload.id);
			if (index !== -1) {
				state.projects[index] = action.payload;
			}
		},
		removeProject: (state, action: PayloadAction<string>) => {
			state.projects = state.projects.filter((p) => p.id !== action.payload);
		},
		setSelectedProject: (state, action: PayloadAction<string | null>) => {
			state.selectedProjectId = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setFilters: (
			state,
			action: PayloadAction<Partial<ProjectsState["filters"]>>,
		) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearFilters: (state) => {
			state.filters = initialState.filters;
		},
	},
});

export const {
	setProjects,
	addProject,
	updateProject,
	removeProject,
	setSelectedProject,
	setLoading,
	setError,
	setFilters,
	clearFilters,
} = projectsSlice.actions;

export default projectsSlice.reducer;
