import { useAppDispatch, useAppSelector } from "@/lib/redux-store/hooks";
import {
	selectAllProjects,
	selectFilteredProjects,
	selectProjectById,
	selectProjectsByStatus,
	selectProjectsCount,
	selectProjectsFilters,
	selectProjectsStats,
	selectSelectedProject,
} from "@/lib/redux-store/projects-selectors";
import {
	clearFilters,
	setError,
	setFilters,
	setLoading,
	setSelectedProject,
} from "@/lib/redux-store/projects-slice";
import type { AppDispatch, RootState } from "@/lib/redux-store/store";

// Project hooks
export const useProjects = () => {
	const dispatch = useAppDispatch();
	const projects = useAppSelector(selectAllProjects);
	const loading = useAppSelector((state) => state.projects.isLoading);
	const error = useAppSelector((state) => state.projects.error);

	return {
		projects,
		loading,
		error,
		setLoading: (loading: boolean) => dispatch(setLoading(loading)),
		setError: (error: string | null) => dispatch(setError(error)),
	};
};

export const useSelectedProject = () => {
	const dispatch = useAppDispatch();
	const selectedProject = useAppSelector(selectSelectedProject);
	const selectedProjectId = useAppSelector(
		(state) => state.projects.selectedProjectId,
	);

	return {
		selectedProject,
		selectedProjectId,
		setSelectedProject: (id: string | null) => dispatch(setSelectedProject(id)),
	};
};

export const useFilteredProjects = () => {
	const filteredProjects = useAppSelector(selectFilteredProjects);
	const filters = useAppSelector(selectProjectsFilters);
	const dispatch = useAppDispatch();

	return {
		filteredProjects,
		filters,
		setFilters: (newFilters: Partial<typeof filters>) =>
			dispatch(setFilters(newFilters)),
		clearFilters: () => dispatch(clearFilters()),
	};
};

export const useProjectsByStatus = () => {
	return useAppSelector(selectProjectsByStatus);
};

export const useProjectsStats = () => {
	return useAppSelector(selectProjectsStats);
};

export const useProjectById = (id: string) => {
	return useAppSelector((state) => selectProjectById(state, id));
};

export const useProjectsCount = () => {
	return useAppSelector(selectProjectsCount);
};

// Search and filter hooks
export const useProjectsSearch = () => {
	const dispatch = useAppDispatch();
	const filters = useAppSelector(selectProjectsFilters);

	const setSearch = (search: string) => {
		dispatch(setFilters({ search }));
	};

	const setStatusFilter = (status: string) => {
		dispatch(setFilters({ status }));
	};

	return {
		search: filters.search,
		statusFilter: filters.status,
		setSearch,
		setStatusFilter,
		clearFilters: () => dispatch(clearFilters()),
	};
};
