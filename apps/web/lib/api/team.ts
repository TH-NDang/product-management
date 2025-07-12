import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "./client";

export interface Team {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	logo: string | null;
}

interface TeamsResponse {
	data: Team[];
}

export type CreateTeamData = {
	name: string;
	description?: string;
	userId: string;
};

interface CreateTeamRequest {
	name: string;
	description: string;
	userId: string;
}

export const createDefaultTeam = async (
	userId: string,
	teamData: Omit<CreateTeamRequest, "userId">,
) => {
	const response = await api.post(
		`/api/project/teams?userId=${encodeURIComponent(userId)}`,
		teamData,
	);
	return response.data;
};

export const useGetTeamsQuery = (userId: string | null) => {
	return useQuery<Team[], Error>({
		queryKey: ["teams", userId],
		queryFn: async () => {
			if (!userId) {
				return [];
			}
			try {
				const response = await api.get(`/api/project/teams/by-user/${userId}`);
				// API trả về cấu trúc { data: [...] }, nên chúng ta cần lấy response.data.data
				return response.data.data || [];
			} catch (error) {
				// Nếu không tìm thấy (404), trả về mảng rỗng. Các lỗi khác sẽ được throw.
				if (error instanceof AxiosError && error.response?.status === 404) {
					return [];
				}
				throw error;
			}
		},
		enabled: !!userId,
		retry: 1,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
};

async function createTeam(teamData: CreateTeamData): Promise<Team> {
	const response = await api.post<Team>("/api/project/teams", teamData);
	return response.data;
}

export const useCreateTeamMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<Team, Error, CreateTeamData>({
		mutationFn: async ({ userId, ...teamData }) => {
			const response = await api.post(
				`/api/project/teams?userId=${userId}`,
				teamData,
			);
			return response.data.data;
		},
		onSuccess: () => {
			toast.success("Team created successfully!");
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create team.");
		},
	});
};
