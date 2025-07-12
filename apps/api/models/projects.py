import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

class ProjectBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    status: str = Field(default="planning")  # planning, active, completed
    start_date: datetime | None = None
    end_date: datetime | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    status: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class ProjectPublic(ProjectBase):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    team_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)