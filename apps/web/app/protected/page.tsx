import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { UserInfo } from "@/components/auth/user-info";
import { TestApi } from "@/components/test-api";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/auth/login");
	}
	console.log("data use supabase", data);

	return (
		<div className="flex h-svh w-full items-center justify-center gap-4 p-4">
			<UserInfo />
			<div className="flex flex-col gap-2">
				<LogoutButton />
				<TestApi />
			</div>
		</div>
	);
}
