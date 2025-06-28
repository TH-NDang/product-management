from fastapi import APIRouter
from services.projects import (
    fetch_project_by_id,
    fetch_projects,
)
from models.projects import ProjectPublic
from dependencies.database import SessionDep

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectPublic])
def list_projects(session: SessionDep):
    return fetch_projects(session)


@router.get("/{project_id}", response_model=ProjectPublic)
def get_project(project_id: str, session: SessionDep):
    return fetch_project_by_id(session, project_id)
