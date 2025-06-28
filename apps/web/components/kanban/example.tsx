"use client";
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/components/kanban";
import { faker } from "@faker-js/faker";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { useState } from "react";
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const columns = [
	{ id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
	{ id: faker.string.uuid(), name: "In Progress", color: "#F59E0B" },
	{ id: faker.string.uuid(), name: "Done", color: "#10B981" },
];
const users = Array.from({ length: 4 })
	.fill(null)
	.map(() => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		image: faker.image.avatar(),
	}));
const exampleFeatures = Array.from({ length: 20 })
	.fill(null)
	.map(() => ({
		id: faker.string.uuid(),
		name: capitalize(faker.company.buzzPhrase()),
		startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
		endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
		column: faker.helpers.arrayElement(columns).id,
		owner: faker.helpers.arrayElement(users),
	}));
const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
});
const Example = () => {
	const [features, setFeatures] = useState(exampleFeatures);
	return (
		<div className="h-full w-full">
			<KanbanProvider
				columns={columns}
				data={features}
				onDataChange={setFeatures}
				className="h-full"
			>
				{(column) => (
					<KanbanBoard
						id={column.id}
						key={column.id}
						className="mx-2 rounded-lg bg-muted p-4 shadow"
					>
						<KanbanHeader className="mb-2 text-foreground/90">
							<div className="flex items-center gap-2">
								<div
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: column.color }}
								/>
								<span>{column.name}</span>
							</div>
						</KanbanHeader>
						<KanbanCards id={column.id}>
							{(feature: (typeof features)[number]) => (
								<KanbanCard
									column={column.id}
									id={feature.id}
									key={feature.id}
									name={feature.name}
									className="mb-2 rounded-md border border-muted bg-background p-3 shadow"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex flex-col gap-1">
											<p className="m-0 flex-1 font-medium text-sm">
												{feature.name}
											</p>
										</div>
										{feature.owner && (
											<Avatar className="h-4 w-4 shrink-0">
												<AvatarImage src={feature.owner.image} />
												<AvatarFallback>
													{feature.owner.name?.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
										)}
									</div>
									<p className="m-0 text-muted-foreground text-xs">
										{shortDateFormatter.format(feature.startAt)} -{" "}
										{dateFormatter.format(feature.endAt)}
									</p>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>
		</div>
	);
};
export default Example;
