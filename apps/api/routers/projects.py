from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List
from services.projects import (
    fetch_project_by_id,
    fetch_projects,
    fetch_projects_paginated,
    create_project,
    update_project,
    delete_project,
    search_projects,
    get_projects_by_status,
)
from models.projects import ProjectPublic, ProjectCreate, ProjectUpdate
from core.database import SessionDep
from services.user import get_current_user
from sqlmodel import select, col, or_, desc
from models.tables import Project

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectPublic])
def list_projects(
    session: SessionDep,
    offset: int = Query(default=0, ge=0, description="Number of items to skip"),
    limit: int = Query(
        default=20, ge=1, le=100, description="Number of items to return"
    ),
    search: str | None = Query(
        default=None, description="Search term for name or description"
    ),
    status: str | None = Query(default=None, description="Filter by status"),
    current_user=Depends(get_current_user),
):
    """Get projects of current user with optional search and filtering"""
    query = select(Project).where(col(Project.created_by_id) == current_user.id)
    if search:
        query = query.where(
            or_(
                col(Project.name).ilike(f"%{search}%"),
                col(Project.description).ilike(f"%{search}%"),
            )
        )
    if status:
        query = query.where(col(Project.status) == status)
    query = query.offset(offset).limit(limit)
    projects = session.exec(query).all()
    return [ProjectPublic.model_validate(project) for project in projects]


@router.get("/status/{status}", response_model=List[ProjectPublic])
def get_projects_by_status_endpoint(
    status: str,
    session: SessionDep,
):
    """Get projects filtered by status"""
    valid_statuses = ["planning", "active", "completed"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )
    return get_projects_by_status(session, status)


@router.post("/", response_model=ProjectPublic)
def create_new_project(
    project: ProjectCreate, session: SessionDep, current_user=Depends(get_current_user)
):
    """Create a new project, always assign created_by_id to current user"""
    return create_project(session, project, current_user)


@router.get("/{project_id}", response_model=ProjectPublic)
def get_project(
    project_id: str, session: SessionDep, current_user=Depends(get_current_user)
):
    """Get a specific project by ID, only if user is owner"""
    project = fetch_project_by_id(session, project_id)
    if project.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return project


@router.put("/{project_id}", response_model=ProjectPublic)
def update_existing_project(
    project_id: str, project: ProjectUpdate, session: SessionDep
):
    """Update an existing project"""
    return update_project(session, project_id, project)


@router.delete("/{project_id}")
def remove_project(project_id: str, session: SessionDep):
    """Delete a project"""
    return delete_project(session, project_id)


@router.get("/recent", response_model=ProjectPublic)
def get_recent_project(session: SessionDep, current_user=Depends(get_current_user)):
    """Get the most recently updated project of the current user"""
    project = session.exec(
        select(Project)
        .where(col(Project.created_by_id) == current_user.id)
        .order_by(desc(col(Project.updated_at)))
        .limit(1)
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="No recent project found")
    return ProjectPublic.model_validate(project)
