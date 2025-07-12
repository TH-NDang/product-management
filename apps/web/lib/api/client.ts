import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to attach token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		// Skip adding token for login endpoint
		if (config.url !== "/api/auth/login" && token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
	(response) => {
		// Handle successful responses
		return response;
	},
	(error) => {
		if (error.code === "ERR_NETWORK") {
			// Handle network errors
			throw new Error("Network error. Please check your internet connection.");
		}

		if (error.response?.status === 401) {
			// Handle unauthorized access
			localStorage.removeItem("token");
			window.location.href = "/login";
		} else if (error.response?.status === 403) {
			// Handle forbidden access
			throw new Error("Access denied. Please try logging in again.");
		} else if (error.response?.status === 400) {
			// Handle bad request
			throw new Error(error.response?.data?.message || "Invalid request.");
		} else if (error.response?.status >= 500) {
			// Handle server errors
			throw new Error("Server error. Please try again later.");
		}

		// For other errors, return the error object
		return Promise.reject(error);
	},
);
