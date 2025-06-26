"use client";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const TestApi = () => {
	const [status, setStatus] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			const supabase = createClient();
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error || !session) {
				toast.error("No session");
				return;
			}
			try {
				const res = await fetch(
					"http://localhost:8000/user/protected-endpoint",
					{
						headers: {
							Authorization: `Bearer ${session.access_token}`,
						},
					},
				);
				const data = await res.json();
				setStatus(JSON.stringify(data));
			} catch (err) {
				toast.error("Failed to fetch user");
			}
		};
		fetchData();
	}, []);

	return (
		<Card>
			<CardHeader>Status</CardHeader>
			<CardContent>{status}</CardContent>
		</Card>
	);
};
