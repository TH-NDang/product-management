"use client";

import { useSupabaseAuth } from "@/lib/supabase/auth-hook";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";

export function UserInfo() {
	const { user, supabaseUser } = useSupabaseAuth();

	if (!user) {
		return <div>Không có thông tin user</div>;
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Thông tin User</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center space-x-4">
					<Avatar>
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">{user.name}</p>
						<p className="text-muted-foreground text-sm">{user.email}</p>
					</div>
				</div>

				{supabaseUser && (
					<div className="space-y-2">
						<p className="text-sm">
							<span className="font-medium">User ID:</span> {supabaseUser.id}
						</p>
						<p className="text-sm">
							<span className="font-medium">Email verified:</span>{" "}
							{supabaseUser.email_confirmed_at ? "Có" : "Chưa"}
						</p>
						<p className="text-sm">
							<span className="font-medium">Created at:</span>{" "}
							{new Date(supabaseUser.created_at).toLocaleDateString("vi-VN")}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
