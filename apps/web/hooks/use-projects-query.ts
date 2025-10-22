import {
	type CreateProjectData,
	projectKeys,
	projectsApi,
} from "@/lib/api/projects";
import type { Project } from "@/lib/config";
import { useAppDispatch } from "@/lib/redux-store/hooks";
import {
	addProject,
	removeProject,
	updateProject,
} from "@/lib/redux-store/projects-slice";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import React from "react";

// Hook for projects query by team
export function useProjects(teamId: string) {
	return useQuery<Project[], Error>({
		queryKey: projectKeys.listByTeam(teamId),
		queryFn: () => projectsApi.getProjects(teamId),
		enabled: !!teamId, // Only run query if teamId is available
	});
}

// Hook for single project query
export function useProject(teamId: string, projectId: string) {
	return useQuery({
		queryKey: projectKeys.detail(projectId),
		queryFn: () => projectsApi.getProject(teamId, projectId),
		enabled: !!teamId && !!projectId,
	});
}

// Hook for creating project
export function useCreateProject(teamId: string) {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation<Project, Error, CreateProjectData>({
		mutationFn: (data: CreateProjectData) =>
			projectsApi.createProject(teamId, data),
		onSuccess: (newProject) => {
			// Update Redux store
			dispatch(addProject(newProject));

			// Invalidate and refetch projects list for the specific team
			queryClient.invalidateQueries({
				queryKey: projectKeys.listByTeam(teamId),
			});

			// Add the new project to the cache
			queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
		},
	});
}

// Hook for updating project
export function useUpdateProject(teamId: string) {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation<
		Project,
		Error,
		{ id: string; data: Partial<CreateProjectData> }
	>({
		// Explicitly type the mutation
		mutationFn: ({ id, data }) => projectsApi.updateProject(id, data),
		onSuccess: (updatedProject) => {
			// Update Redux store
			dispatch(updateProject(updatedProject));

			// Update the project in cache
			queryClient.setQueryData(
				projectKeys.detail(updatedProject.id),
				updatedProject,
			);

			// Invalidate projects list for the specific team to reflect changes
			queryClient.invalidateQueries({
				queryKey: projectKeys.listByTeam(teamId),
			});
		},
	});
}

// Hook for deleting project
export function useDeleteProject(teamId: string) {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation({
		mutationFn: (projectId: string) =>
			projectsApi.deleteProject(teamId, projectId),
		onSuccess: (_, deletedId) => {
			// Update Redux store
			dispatch(removeProject(deletedId));

			// Remove from cache
			queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });

			// Invalidate projects list for the specific team
			queryClient.invalidateQueries({
				queryKey: projectKeys.listByTeam(teamId),
			});
		},
	});
}

// Hook for projects with Redux integration
export function useProjectsWithRedux(teamId: string) {
	const dispatch = useAppDispatch();
	const query = useProjects(teamId);

	// Sync with Redux when data changes
	React.useEffect(() => {
		if (query.data) {
			// Data is now a simple array, not paginated
			dispatch({ type: "projects/setProjects", payload: query.data });
		}
	}, [query.data, dispatch]);

	return query;
}
