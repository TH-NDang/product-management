import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";

export const UserOnline = () => {
	return (
		<div>
			<div className="ml-2 flex items-center gap-2">
				{/* <div className="relative">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="Kelly King" />
						<AvatarFallback>KK</AvatarFallback>
					</Avatar>
					<span className="-end-0.5 -bottom-0.5 absolute size-3 rounded-full border-2 border-background bg-emerald-500">
						<span className="sr-only">Online</span>
					</span>
				</div> */}
				<Button
					variant="secondary"
					className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground text-xs ring-background hover:bg-secondary hover:text-foreground"
					size="icon"
				>
					+3
				</Button>
			</div>
		</div>
	);
};
