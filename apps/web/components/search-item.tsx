"use client";

import {
	ArrowUpRightIcon,
	CircleFadingPlusIcon,
	FileInputIcon,
	FolderPlusIcon,
	SearchIcon,
} from "lucide-react";
import * as React from "react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@workspace/ui/components/command";

export default function SearchItem() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<button
				type="button"
				className="inline-flex h-9 min-w-[320px] rounded-md border border-input bg-background px-4 py-2 text-foreground text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				onClick={() => setOpen(true)}
			>
				<span className="flex grow items-center">
					<SearchIcon
						className="-ms-1 me-3 text-muted-foreground/80"
						size={16}
						aria-hidden="true"
					/>
					<span className="font-normal text-muted-foreground/70">Search</span>
				</span>
				<kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
					⌘K
				</kbd>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Quick start">
						<CommandItem>
							<FolderPlusIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>New folder</span>
							<CommandShortcut className="justify-center">⌘N</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<FileInputIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Import document</span>
							<CommandShortcut className="justify-center">⌘I</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CircleFadingPlusIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Add block</span>
							<CommandShortcut className="justify-center">⌘B</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Navigation">
						<CommandItem>
							<ArrowUpRightIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Go to dashboard</span>
						</CommandItem>
						<CommandItem>
							<ArrowUpRightIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Go to apps</span>
						</CommandItem>
						<CommandItem>
							<ArrowUpRightIcon
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Go to connections</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
