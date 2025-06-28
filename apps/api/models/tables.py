import uuid
from datetime import datetime

from sqlmodel import Field

from models.tasks import TaskBase


class Task(TaskBase, table=True):
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: str = Field(index=True)
    created_by_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
