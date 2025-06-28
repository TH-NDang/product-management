from fastapi import APIRouter, Query
from typing import List
from services.projects import (
    fetch_project_by_id,
    fetch_projects,
    fetch_projects_paginated,
)
from models.projects import ProjectPublic
from dependencies.database import SessionDep

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectPublic])
def list_projects(
    session: SessionDep,
    offset: int = Query(default=0, ge=0, description="Number of items to skip"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of items to return"),
):
    return fetch_projects_paginated(session, offset, limit)


@router.get("/{project_id}", response_model=ProjectPublic)
def get_project(project_id: str, session: SessionDep):
    return fetch_project_by_id(session, project_id)
