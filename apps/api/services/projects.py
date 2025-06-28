from models.projects import ProjectPublic
from models.tables import Project
from fastapi import HTTPException
from sqlmodel import Session, select

from core import database


def fetch_projects(session: Session):
    return session.exec(select(Project)).all()


def fetch_projects_paginated(session: Session, offset: int = 0, limit: int = 20):
    """Fetch projects with pagination support"""
    query = select(Project).offset(offset).limit(limit)
    return session.exec(query).all()


def fetch_project_by_id(session: Session, project_id: str) -> ProjectPublic:
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectPublic.model_validate(project)
