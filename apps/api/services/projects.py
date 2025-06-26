from api.models.projects import Project, ProjectPublic
from fastapi import HTTPException
from sqlmodel import Session, select

from api.core import database


def fetch_projects(session: Session):
    return session.exec(select(Project)).all()


def fetch_project_by_id(session: Session, project_id: str) -> ProjectPublic:
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectPublic.model_validate(project)
