from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..core import config

router = APIRouter()


class StatusResponse(BaseModel):
    server: str
    database: str


@router.get(
    "/status",
    summary="Get API status",
    description="Returns the current status of the API. Useful for health checks.",
    response_description="A JSON object indicating the API status.",
    tags=["Status", "Test"],
    response_model=StatusResponse,
)
async def status(settings: config.Settings = Depends(config.get_settings)):
    """
    Health check endpoint to verify that the API is running.

    Returns:
        dict: A dictionary with a single key 'status' and value 'ok'.
    """
    return StatusResponse(
        server="ok",
        database="ok" if settings.DATABASE_URL else "Not found DATABASE_URL",
    )
