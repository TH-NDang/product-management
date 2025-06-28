import uuid
from datetime import datetime

from sqlmodel import Field

from models.projects import ProjectBase
from models.tasks import TaskBase
from models.teams import TeamBase
from models.users import UserBase


class Task(TaskBase, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Project(ProjectBase, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    status: str
    start_date: datetime | None = None
    end_date: datetime | None = None
    team_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    encrypted_password: str
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())


class Team(TeamBase, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
