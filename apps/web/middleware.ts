import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/", "/dashboard", "/profile", "/settings"];
const publicAuthRoutes = ["/login", "/signup", "/oauth2"];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

// Add a state to track redirects and prevent loops
const redirectState = {
	isRedirecting: false,
	redirectCount: 0,
	MAX_REDIRECTS: 3,
};

export async function middleware(request: NextRequest) {
	// Prevent infinite redirects
	if (redirectState.isRedirecting) {
		redirectState.redirectCount++;
		if (redirectState.redirectCount >= redirectState.MAX_REDIRECTS) {
			console.error("Preventing infinite redirect loop");
			return NextResponse.next();
		}
	}

	const token = request.cookies.get("token")?.value;

	// Get the current path and search params
	const { pathname } = request.nextUrl;
	const url = request.nextUrl.clone();
	const response = NextResponse.next();

	// Allow access to public auth routes
	if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
		// If user is already authenticated and tries to access login/signup, redirect to home
		if (token && (pathname === "/login" || pathname === "/signup")) {
			redirectState.isRedirecting = true;
			url.pathname = "/";
			return NextResponse.redirect(url);
		}
		return response;
	}

	// Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);
	const isApiRoute = pathname.startsWith("/api/");

	// Validate token for protected routes
	if (isProtectedRoute || isApiRoute) {
		if (!token) {
			redirectState.isRedirecting = true;
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}

		try {
			const response = await axios.post(`${API_URL}/api/auth/validate`, {
				token,
			});
			const validationResult = response.data;
			if (!validationResult.data) {
				redirectState.isRedirecting = true;
				url.pathname = "/login";
				return NextResponse.redirect(url);
			}
		} catch (error) {
			console.error("Error validating token:", error);
			redirectState.isRedirecting = true;
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}
	}

	// Reset redirect state for non-redirect responses
	redirectState.isRedirecting = false;
	redirectState.redirectCount = 0;

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
