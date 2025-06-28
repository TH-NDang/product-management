from datetime import datetime

from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    status: str
    start_date: datetime | None = Field(default=None)
    end_date: datetime | None = Field(default=None)


