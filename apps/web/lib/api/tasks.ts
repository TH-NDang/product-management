import { api } from './client';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
}

export const getTasksByProject = async (projectId: string, userId: string): Promise<Task[]> => {
  const response = await api.get(`/api/project/tasks`, {
    params: { projectId, userId },
  });
  return response.data;
};

export const getTaskById = async (id: string, userId: string): Promise<Task> => {
  const response = await api.get(`/api/project/tasks/${id}`, {
    params: { userId },
  });
  return response.data;
};

export const createTask = async (data: CreateTaskDto, userId: string): Promise<Task> => {
  const response = await api.post(`/api/project/tasks?userId=${userId}`, data);
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: 'TODO' | 'IN_PROGRESS' | 'DONE',
  userId: string
): Promise<void> => {
  await api.patch(`/api/project/tasks/${taskId}/status?status=${status}&userId=${userId}`);
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  await api.delete(`/api/project/tasks/${taskId}?userId=${userId}`);
};
