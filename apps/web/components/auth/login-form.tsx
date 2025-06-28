"use client";

import { configNav } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;
			// Update this route to redirect to an authenticated route. The user already has an active session.
			// router.push("/protected");
			router.push(`${configNav.mainLink}`);
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/oauth?next=${configNav.mainLink}`,
				},
			});

			if (error) throw error;
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred");
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4">
						<Button
							variant="outline"
							type="button"
							onClick={handleGoogleLogin}
							className="w-full"
							disabled={isLoading}
						>
							{/* Có thể thay thế icon Google nếu có */}
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
								<title>Google Icon</title>
								<path
									fill="currentColor"
									d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.148s2.765-6.148 6.148-6.148c1.922 0 3.211.82 3.953 1.523l2.703-2.648c-1.703-1.57-3.898-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.648-.07-1.148-.156-1.684z"
								/>
							</svg>
							Login with Google
						</Button>
					</div>
					<form onSubmit={handleLogin}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<Link
										href="/auth/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Logging in..." : "Login"}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link
								href="/auth/sign-up"
								className="underline underline-offset-4"
							>
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
