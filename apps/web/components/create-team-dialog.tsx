import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateTeamData, useCreateTeamMutation } from "@/lib/api/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { toast } from "sonner";

const formSchema = z.object({
	name: z.string().min(1, "Team name is required"),
	description: z.string().optional(),
});

interface CreateTeamDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId: string | null;
}

export function CreateTeamDialog({
	open,
	onOpenChange,
	userId,
}: CreateTeamDialogProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const createTeamMutation = useCreateTeamMutation();

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		if (!userId) {
			toast.error("You must be logged in to create a team.");
			return;
		}
		createTeamMutation.mutate(
			{ ...values, userId },
			{
				onSuccess: () => {
					onOpenChange(false);
					form.reset();
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new team</DialogTitle>
					<DialogDescription>
						Enter a name and description for your new team.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Team Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., Marketing Team" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="e.g., Responsible for marketing"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createTeamMutation.isPending}>
								{createTeamMutation.isPending ? "Creating..." : "Create Team"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
