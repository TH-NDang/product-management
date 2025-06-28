"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "@workspace/ui/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

const themes = [
	{
		key: "system",
		icon: Monitor,
		label: "System theme",
	},
	{
		key: "light",
		icon: Sun,
		label: "Light theme",
	},
	{
		key: "dark",
		icon: Moon,
		label: "Dark theme",
	},
];

export type ThemeSwitcherProps = {
	value?: "light" | "dark" | "system";
	onChange?: (theme: "light" | "dark" | "system") => void;
	defaultValue?: "light" | "dark" | "system";
	className?: string;
};

export const ThemeSwitcher = ({
	value,
	onChange,
	defaultValue = "system",
	className,
}: ThemeSwitcherProps) => {
	// Use next-themes' useTheme hook
	const { theme: currentTheme, setTheme: setAppTheme } = useTheme();

	// We still use useControllableState for component's internal state
	const [localTheme, setLocalTheme] = useControllableState({
		defaultProp: defaultValue,
		prop: value || (currentTheme as "light" | "dark" | "system"),
		onChange: (newTheme) => {
			onChange?.(newTheme);
			setAppTheme(newTheme); // Update the system theme
		},
	});

	const [mounted, setMounted] = useState(false);

	// When currentTheme changes externally, update our local state
	useEffect(() => {
		if (mounted && currentTheme && !value) {
			setLocalTheme(currentTheme as "light" | "dark" | "system");
		}
	}, [currentTheme, setLocalTheme, mounted, value]);

	const handleThemeClick = useCallback(
		(themeKey: "light" | "dark" | "system") => {
			setLocalTheme(themeKey);
			setAppTheme(themeKey);
		},
		[setLocalTheme, setAppTheme],
	);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div
			className={cn(
				"relative isolate flex h-8 justify-around rounded-full bg-background p-1 ring-1 ring-border",
				className,
			)}
		>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = localTheme === key;

				return (
					<button
						aria-label={label}
						className="relative h-6 w-6 rounded-full"
						key={key}
						onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
						type="button"
					>
						{isActive && (
							<motion.div
								className="absolute inset-0 rounded-full bg-secondary"
								layoutId="activeTheme"
								transition={{ type: "spring", duration: 0.5 }}
							/>
						)}
						<Icon
							className={cn(
								"relative z-10 m-auto h-4 w-4",
								isActive ? "text-foreground" : "text-muted-foreground",
							)}
						/>
					</button>
				);
			})}
		</div>
	);
};
