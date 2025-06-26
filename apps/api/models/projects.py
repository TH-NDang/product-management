import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

# export const projects = pgTable("projects", {
# 	id: text("id").primaryKey().$defaultFn(() => sql`generate_ulid()`),
# 	name: text("name").notNull(),
# 	description: text("description"),
# 	status: projectStatusEnum("status").default('planning').notNull(),
# 	startDate: timestamp("start_date"),
# 	endDate: timestamp("end_date"),
# 	teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }), // Xóa team thì xóa luôn project
# 	createdById: text("created_by_id").references(() => user.id, { onDelete: "set null" }), // Nếu user tạo bị xóa, giữ lại project
# 	createdAt: timestamp("created_at").defaultNow().notNull(),
# 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
# });


class Project(SQLModel, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    description: str
    status: str
    start_date: datetime = Field(default_factory=datetime.now)
    end_date: datetime | None = Field(default_factory=datetime.now)
    team_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
