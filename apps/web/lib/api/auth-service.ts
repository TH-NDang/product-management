import axios from "axios";

interface ApiResponse<T> {
	status: number;
	message: string;
	data: T;
	success: boolean;
}

interface TokenValidationResponse extends ApiResponse<boolean> {}

interface UserResponse extends ApiResponse<{ email: string; role: string }> {}

export const authService = {
	async validateToken(token: string): Promise<boolean> {
		try {
			const response = await axios.post<TokenValidationResponse>(
				"/api/auth/validate",
				{ token },
			);
			return response.data.data;
		} catch (error) {
			console.error("Error validating token:", error);
			return false;
		}
	},

	async fetchUserData(token: string): Promise<UserResponse["data"]> {
		try {
			const response = await axios.get<UserResponse>("/api/auth/user", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data.data;
		} catch (error) {
			console.error("Error fetching user data:", error);
			throw error;
		}
	},
};
