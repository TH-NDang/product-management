import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal } from "lucide-react";

export default function Participants() {
	return (
		<div className="-space-x-[0.45rem] flex">
			<img
				className="rounded-full ring-1 ring-background"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-16_zn3ygb.jpg"
				width={24}
				height={24}
				alt="Avatar 01"
			/>
			<img
				className="rounded-full ring-1 ring-background"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-10_qyybkj.jpg"
				width={24}
				height={24}
				alt="Avatar 02"
			/>
			<img
				className="rounded-full ring-1 ring-background"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-15_fguzbs.jpg"
				width={24}
				height={24}
				alt="Avatar 03"
			/>
			<img
				className="rounded-full ring-1 ring-background"
				src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-11_jtjhsp.jpg"
				width={24}
				height={24}
				alt="Avatar 04"
			/>
			<Button
				variant="outline"
				className="flex size-6 items-center justify-center rounded-full border-transparent text-muted-foreground/80 text-xs shadow-none ring-1 ring-background dark:border-transparent dark:bg-background dark:hover:bg-background"
				size="icon"
			>
				<MoreHorizontal className="size-4" size={16} />
			</Button>
		</div>
	);
}
