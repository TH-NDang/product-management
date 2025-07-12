import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/", "/dashboard", "/profile", "/settings"];

const publicAuthRoutes = ["/login", "/signup", "/oauth2"];

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;

	// Get the current path and search params
	const { pathname } = request.nextUrl;
	const url = request.nextUrl.clone();
	const response = NextResponse.next();

	// Allow access to public auth routes
	if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
		// If user is already authenticated and tries to access login/signup, redirect to home
		if (token && (pathname === "/login" || pathname === "/signup")) {
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

	// If it's a protected route and no token exists, redirect to login
	if (isProtectedRoute && !token && !isApiRoute) {
		// Store the current path to redirect back after login
		url.pathname = "/login";
		url.searchParams.set("from", pathname);
		return NextResponse.redirect(url);
	}

	// For all other routes, continue
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
