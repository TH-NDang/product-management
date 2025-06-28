import { roles } from "@/data/data";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { Search } from "lucide-react";

interface MembersSearchProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	roleFilter: string;
	setRoleFilter: (role: string) => void;
}

export function MembersSearch({
	searchQuery,
	setSearchQuery,
	roleFilter,
	setRoleFilter,
}: MembersSearchProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-gray-400" />
						<Input
							placeholder="Search members by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={roleFilter} onValueChange={setRoleFilter}>
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue placeholder="Filter by role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							{roles.map((role) => (
								<SelectItem key={role.value} value={role.value}>
									{role.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}
