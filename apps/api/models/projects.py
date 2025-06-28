import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

class ProjectBase(SQLModel):
    name: str = Field(index=True)
    description: str | None = Field(default=None)


class ProjectPublic(ProjectBase):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    status: str
    start_date: datetime | None = None
    end_date: datetime | None = None
    team_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)