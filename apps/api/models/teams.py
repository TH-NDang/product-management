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


