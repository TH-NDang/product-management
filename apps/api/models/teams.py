import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


# export const teams = pgTable("teams", {
# 	id: text("id").primaryKey().$defaultFn(() => sql`generate_ulid()`), // Hoặc dùng thư viện như nanoid
# 	name: text("name").notNull(),
# 	description: text("description"),
# 	ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "restrict" }), // Không cho xóa user nếu họ đang là owner của team
# 	createdAt: timestamp("created_at").defaultNow().notNull(),
# 	updatedAt: timestamp("updated_at").defaultNow().notNull(),
# });


class TeamBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None)


class Team(TeamBase, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
