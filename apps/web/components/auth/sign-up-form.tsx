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

export function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		if (password !== repeatPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/${configNav.mainLink}`,
				},
			});
			if (error) throw error;
			router.push("/auth/sign-up-success");
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async (e: React.FormEvent) => {
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
					<CardTitle className="text-2xl">Sign up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4">
						<Button
							variant="outline"
							type="button"
							onClick={handleGoogleSignUp}
							className="w-full"
							disabled={isLoading}
						>
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
								<title>Google Icon</title>
								<path
									fill="currentColor"
									d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.148s2.765-6.148 6.148-6.148c1.922 0 3.211.82 3.953 1.523l2.703-2.648c-1.703-1.57-3.898-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.648-.07-1.148-.156-1.684z"
								/>
							</svg>
							Sign up with Google
						</Button>
					</div>
					<form onSubmit={handleSignUp}>
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
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="repeat-password">Repeat Password</Label>
								</div>
								<Input
									id="repeat-password"
									type="password"
									required
									value={repeatPassword}
									onChange={(e) => setRepeatPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating an account..." : "Sign up"}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link href="/auth/login" className="underline underline-offset-4">
								Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
