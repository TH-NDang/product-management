import { roles } from "@/data/data";
import {
	getRoleColor,
	getRoleDescription,
	getRoleIcon,
	parseEmails,
	validateEmail,
} from "@/lib/members-utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { AlertCircle, CheckCircle, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export type ModalAddUserProps = {
	children: React.ReactNode;
};

export function ModalAddUser({ children }: ModalAddUserProps) {
	const [selectedRole, setSelectedRole] = useState("");
	const [emails, setEmails] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission here
		console.log({ emails, selectedRole, message });
	};

	const emailData = parseEmails(emails);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Mail className="size-5" />
							Invite Team Members
						</DialogTitle>
						<DialogDescription className="mt-2 text-sm leading-6">
							Invite people to collaborate on your workspace. You can invite
							multiple people at once by separating email addresses with commas.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* Email Input */}
						<div className="space-y-2">
							<Label htmlFor="emails" className="font-medium">
								Email addresses
							</Label>
							<Textarea
								id="emails"
								placeholder="Enter email addresses separated by commas..."
								value={emails}
								onChange={(e) => setEmails(e.target.value)}
								className="min-h-[100px] resize-none"
							/>
							{emailData.all.length > 0 && (
								<div className="space-y-2">
									<div className="flex flex-wrap gap-2">
										{emailData.valid.map((email, index) => (
											<Badge key={index} variant="secondary" className="gap-1">
												<CheckCircle className="size-3 text-green-600" />
												{email}
											</Badge>
										))}
										{emailData.invalid.map((email, index) => (
											<Badge
												key={index}
												variant="destructive"
												className="gap-1"
											>
												<AlertCircle className="size-3" />
												{email}
											</Badge>
										))}
									</div>
									{emailData.invalid.length > 0 && (
										<p className="text-red-600 text-sm dark:text-red-400">
											Please check the email format for invalid addresses.
										</p>
									)}
								</div>
							)}
						</div>

						{/* Role Selection */}
						<div className="space-y-3">
							<Label className="font-medium">Role</Label>
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								{roles.map((role) => (
									<button
										type="button"
										key={role.value}
										className={`relative w-full rounded-lg border-2 p-3 text-left transition-all hover:border-gray-300 dark:hover:border-gray-600 ${
											selectedRole === role.value
												? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/20"
												: "border-gray-200 dark:border-gray-700"
										}`}
										onClick={() => setSelectedRole(role.value)}
									>
										<input
											type="radio"
											name="role"
											value={role.value}
											checked={selectedRole === role.value}
											onChange={() => setSelectedRole(role.value)}
											className="sr-only"
										/>
										<div className="flex items-center gap-2">
											<div
												className={`flex size-8 items-center justify-center rounded-full ${getRoleColor(role.value)}`}
											>
												{getRoleIcon(role.value)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-gray-900 text-sm dark:text-gray-50">
													{role.label}
												</p>
												<p className="text-gray-500 text-xs dark:text-gray-400">
													{getRoleDescription(role.value)}
												</p>{" "}
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Personal Message */}
						<div className="space-y-2">
							<Label htmlFor="message" className="font-medium">
								Personal message (optional)
							</Label>
							<Textarea
								id="message"
								placeholder="Add a personal message to your invitation..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="min-h-[80px] resize-none"
							/>
						</div>

						{/* Invitation Preview */}
						{emailData.valid.length > 0 && selectedRole && (
							<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/20">
								<h4 className="mb-2 font-medium text-gray-900 text-sm dark:text-gray-50">
									Invitation Preview
								</h4>
								<div className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
									<p>
										<strong>To:</strong> {emailData.valid.length} recipient
										{emailData.valid.length > 1 ? "s" : ""}
									</p>
									<p>
										<strong>Role:</strong>{" "}
										{roles.find((r) => r.value === selectedRole)?.label}
									</p>
									{message && (
										<p>
											<strong>Message:</strong> {message}
										</p>
									)}
								</div>
							</div>
						)}
					</div>

					<DialogFooter className="gap-2">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={!emailData.valid.length || !selectedRole}
							className="gap-2"
						>
							<MessageSquare className="size-4" />
							Send Invitations ({emailData.valid.length})
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
