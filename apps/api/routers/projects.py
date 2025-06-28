from fastapi import APIRouter, Query, HTTPException
from typing import List
from services.projects import (
    fetch_project_by_id,
    fetch_projects,
    fetch_projects_paginated,
    create_project,
    delete_project,
)
from models.projects import ProjectPublic, ProjectBase
from dependencies.database import SessionDep

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectPublic])
def list_projects(
    session: SessionDep,
    offset: int = Query(default=0, ge=0, description="Number of items to skip"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of items to return"),
):
    return fetch_projects_paginated(session, offset, limit)


@router.post("/", response_model=ProjectPublic)
def create_new_project(project: ProjectBase, session: SessionDep):
    return create_project(session, project)


@router.get("/{project_id}", response_model=ProjectPublic)
def get_project(project_id: str, session: SessionDep):
    return fetch_project_by_id(session, project_id)


@router.delete("/{project_id}")
def remove_project(project_id: str, session: SessionDep):
    return delete_project(session, project_id)
