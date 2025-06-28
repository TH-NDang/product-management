import {
	type CreateProjectData,
	projectKeys,
	projectsApi,
} from "@/lib/api/projects";
import type { Project } from "@/lib/config";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
	addProject,
	removeProject,
	updateProject,
} from "@/lib/redux/projects-slice";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import React from "react";

// Hook for infinite projects query
export function useInfiniteProjects(pageSize = 20) {
	return useInfiniteQuery({
		queryKey: projectKeys.lists(),
		queryFn: ({ pageParam = 0 }) =>
			projectsApi.getProjects(pageParam, pageSize),
		getNextPageParam: (lastPage, allPages) => {
			// If we got less items than pageSize, we've reached the end
			if (lastPage.length < pageSize) {
				return undefined;
			}
			return allPages.length * pageSize;
		},
		initialPageParam: 0,
	});
}

// Hook for single project query
export function useProject(id: string) {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: () => projectsApi.getProject(id),
		enabled: !!id,
	});
}

// Hook for creating project
export function useCreateProject() {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation({
		mutationFn: (data: CreateProjectData) => projectsApi.createProject(data),
		onSuccess: (newProject) => {
			// Update Redux store
			dispatch(addProject(newProject));

			// Invalidate and refetch projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

			// Add the new project to the cache
			queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
		},
	});
}

// Hook for updating project
export function useUpdateProject() {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: { id: string; data: Partial<CreateProjectData> }) =>
			projectsApi.updateProject(id, data),
		onSuccess: (updatedProject) => {
			// Update Redux store
			dispatch(updateProject(updatedProject));

			// Update the project in cache
			queryClient.setQueryData(
				projectKeys.detail(updatedProject.id),
				updatedProject,
			);

			// Invalidate projects list to reflect changes
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
}

// Hook for deleting project
export function useDeleteProject() {
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	return useMutation({
		mutationFn: (id: string) => projectsApi.deleteProject(id),
		onSuccess: (_, deletedId) => {
			// Update Redux store
			dispatch(removeProject(deletedId));

			// Remove from cache
			queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });

			// Invalidate projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
}

// Hook for projects with Redux integration
export function useProjectsWithRedux(pageSize = 20) {
	const dispatch = useAppDispatch();
	const query = useInfiniteProjects(pageSize);

	// Sync with Redux when data changes
	React.useEffect(() => {
		if (query.data) {
			const allProjects = query.data.pages.flat();
			dispatch({ type: "projects/setProjects", payload: allProjects });
		}
	}, [query.data, dispatch]);

	return query;
}
