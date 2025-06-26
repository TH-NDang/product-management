import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
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
		<div className="flex h-svh w-full items-center justify-center gap-2">
			<p>
				Hello <span>{data.user.email}</span>
			</p>
			<LogoutButton />
			<TestApi />
		</div>
	);
}
