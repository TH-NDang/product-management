import uuid
from datetime import datetime
from typing import List

from models.projects import ProjectPublic, ProjectCreate, ProjectUpdate
from models.tables import Project
from fastapi import HTTPException
from sqlmodel import Session, select

from core import database


def fetch_projects(session: Session) -> List[ProjectPublic]:
    """Fetch all projects"""
    projects = session.exec(select(Project)).all()
    return [ProjectPublic.model_validate(project) for project in projects]


def fetch_projects_paginated(session: Session, offset: int = 0, limit: int = 20) -> List[ProjectPublic]:
    """Fetch projects with pagination support"""
    query = select(Project).offset(offset).limit(limit)
    projects = session.exec(query).all()
    return [ProjectPublic.model_validate(project) for project in projects]


def create_project(session: Session, project_data: ProjectCreate, current_user) -> ProjectPublic:
    """Create a new project, always assign created_by_id to current user"""
    # Validate status
    valid_statuses = ["planning", "active", "completed"]
    if project_data.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    # Validate dates
    if project_data.start_date and project_data.end_date:
        if project_data.start_date > project_data.end_date:
            raise HTTPException(
                status_code=400,
                detail="Start date cannot be after end date"
            )

    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.name,
        description=project_data.description,
        status=project_data.status,
        start_date=project_data.start_date,
        end_date=project_data.end_date,
        team_id=str(uuid.uuid4()),  # Default team ID - in real app this would come from auth
        created_by_id=current_user.id,  # Always use current user
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    session.add(project)
    session.commit()
    session.refresh(project)

    return ProjectPublic.model_validate(project)


def update_project(session: Session, project_id: str, project_data: ProjectUpdate) -> ProjectPublic:
    """Update an existing project"""
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update fields if provided
    update_data = project_data.model_dump(exclude_unset=True)

    # Validate status if provided
    if "status" in update_data:
        valid_statuses = ["planning", "active", "completed"]
        if update_data["status"] not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )

    # Validate dates if provided
    if "start_date" in update_data or "end_date" in update_data:
        start_date = update_data.get("start_date", project.start_date)
        end_date = update_data.get("end_date", project.end_date)
        if start_date and end_date and start_date > end_date:
            raise HTTPException(
                status_code=400,
                detail="Start date cannot be after end date"
            )

    # Apply updates
    for field, value in update_data.items():
        setattr(project, field, value)

    project.updated_at = datetime.now()

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
    """Fetch a single project by ID"""
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectPublic.model_validate(project)


def search_projects(session: Session, search_term: str, status: str | None = None) -> List[ProjectPublic]:
    """Search projects by name or description"""
    query = select(Project)

    # Add search filter
    if search_term:
        query = query.where(
            (Project.name.ilike(f"%{search_term}%")) |
            (Project.description.ilike(f"%{search_term}%"))
        )

    # Add status filter
    if status:
        query = query.where(Project.status == status)

    projects = session.exec(query).all()
    return [ProjectPublic.model_validate(project) for project in projects]


def get_projects_by_status(session: Session, status: str) -> List[ProjectPublic]:
    """Get projects filtered by status"""
    query = select(Project).where(Project.status == status)
    projects = session.exec(query).all()
    return [ProjectPublic.model_validate(project) for project in projects]
