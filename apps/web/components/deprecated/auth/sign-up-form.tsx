import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import Loader from "@/components/loader";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod/v4";

const formSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	name: z.string().min(2),
});

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await authClient.signUp.email(
			{
				email: values.email,
				password: values.password,
				name: values.name,
			},
			{
				onSuccess: () => {
					router.push("/");
					toast.success("Sign up successful");
				},
				onError: (error) => {
					toast.error(`Error: ${error.error.message}`);
				},
			},
		);
	}

	async function handleGoogleSignIn() {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: window.location.origin,
			});
		} catch (error) {
			toast.error("Failed to sign in with Google");
		}
	}

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex items-center justify-center py-4">
			<div className="w-full max-w-md">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="mb-6 flex flex-col items-center space-y-2 text-center">
						<div className="rounded-full bg-primary/10 p-3">
							<UserPlus className="h-6 w-6 text-primary" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							Create your account
						</h1>
						<p className="text-muted-foreground text-sm">
							Welcome! Please fill in the details to get started.
						</p>
					</div>

					<div className="mb-6 flex flex-col gap-4">
						<Button
							variant="outline"
							onClick={handleGoogleSignIn}
							className="w-full"
						>
							<Icons.google className="mr-2" />
							Continue with Google
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter your name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
						Already have an account?{" "}
						<Button
							variant="link"
							onClick={onSwitchToSignIn}
							className="text-primary hover:text-primary/90"
						>
							Sign in
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
