import { useLoginMutation } from "@/lib/api/auth";
import { useGoogleLogin } from "@/lib/api/google-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";

import { loginStart } from "@/lib/redux-store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { ArrowRight, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "../icons";
import Loader from "../loader";

const formSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const { isAuthenticated, loading, error } = useAppSelector(
		(state) => state.auth,
	);
	const loginMutation = useLoginMutation();
	const { mutate: googleLogin } = useGoogleLogin();

	const redirectTo = searchParams.get("from") || "/";

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Reset any previous errors
		form.clearErrors();

		try {
			dispatch(loginStart());

			loginMutation.mutate(values, {
				onSuccess: (response) => {
					if (response?.success) {
						setTimeout(() => {
							router.push(redirectTo);
						}, 100);
					}
				},
			});
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Login failed";
			console.error("Login error:", errorMessage);
		}
	}

	async function handleGoogleSignIn() {
		try {
			googleLogin();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in with Google";
			toast.error(errorMessage);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-4">
				<div className="w-full max-w-md">
					<div className="rounded-lg border bg-card p-6 shadow-sm">
						<div className="flex items-center justify-center">
							<Loader />
						</div>
						<p className="mt-4 text-center text-muted-foreground text-sm">
							Signing in...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		toast.error(error);
	}

	return (
		<div className="flex items-center justify-center py-4">
			<div className="w-full max-w-md">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="mb-6 flex flex-col items-center space-y-2 text-center">
						<div className="rounded-full bg-primary/10 p-3">
							<LogIn className="h-6 w-6 text-primary" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							Welcome back
						</h1>
						<p className="text-muted-foreground text-sm">
							Please sign in to your account to continue.
						</p>
					</div>

					<div className="mb-6 flex flex-col gap-4">
						<Button
							variant="outline"
							onClick={handleGoogleSignIn}
							className="w-full"
						>
							<Icons.google className="mr-2 h-4 w-4" />
							Sign in with Google
						</Button>
					</div>

					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter your email" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="password"
												placeholder="Enter your password"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								<div className="flex items-center justify-center gap-2">
									Continue
									<ArrowRight className="h-4 w-4" />
								</div>
							</Button>
						</form>
					</Form>

					<div className="mt-6 flex items-center justify-center text-sm">
						Need an account?{" "}
						<Button
							variant="link"
							onClick={onSwitchToSignUp}
							className="text-primary hover:text-primary/90"
						>
							Sign up
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
