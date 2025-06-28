from sqlmodel import Field, SQLModel


class TeamBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None)


