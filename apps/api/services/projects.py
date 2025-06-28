import uuid
from datetime import datetime
from models.projects import ProjectPublic, ProjectBase
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


def create_project(session: Session, project_data: ProjectBase) -> ProjectPublic:
    """Create a new project"""
    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.name,
        description=project_data.description,
        status="active",  # Default status
        team_id=str(uuid.uuid4()),  # Default team ID
        created_by_id=str(uuid.uuid4()),  # Default creator ID
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return ProjectPublic.model_validate(project)


def delete_project(session: Session, project_id: str) -> dict:
    """Delete a project by ID"""
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    session.delete(project)
    session.commit()
    
    return {"message": "Project deleted successfully"}


def fetch_project_by_id(session: Session, project_id: str) -> ProjectPublic:
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectPublic.model_validate(project)
