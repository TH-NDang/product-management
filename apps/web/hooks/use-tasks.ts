import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskDto, getTasksByProject, getTaskById, createTask, updateTaskStatus, deleteTask } from '../lib/api/tasks';

export const useTasks = (projectId: string, userId: string) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', projectId, userId],
    queryFn: () => getTasksByProject(projectId, userId),
    enabled: !!projectId && !!userId,
  });
};

export const useTask = (taskId: string, userId: string) => {
  return useQuery<Task, Error>({
    queryKey: ['task', taskId, userId],
    queryFn: () => getTaskById(taskId, userId),
    enabled: !!taskId && !!userId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { data: CreateTaskDto; userId: string; }>({
    mutationFn: ({ data, userId }) => createTask(data, userId),
    onSuccess: (_, { data }) => {
      // Invalidate and refetch tasks for the project
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.projectId]
      });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { taskId: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; userId: string; }>({
    mutationFn: ({ taskId, status, userId }) =>
      updateTaskStatus(taskId, status, userId),
    onSuccess: (_, { taskId, userId }) => {
      // Invalidate both the specific task and the tasks list
      queryClient.invalidateQueries({ queryKey: ['task', taskId, userId] });
      // We don't know the projectId here, so we'll need to invalidate all tasks queries
      // In a real app, you might want to pass the projectId as well
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { taskId: string; userId: string; projectId: string; }>({
    mutationFn: ({ taskId, userId }) => deleteTask(taskId, userId),
    onSuccess: (_, { projectId, userId }) => {
      // Invalidate tasks list for the project
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId, userId]
      });
    },
  });
};
