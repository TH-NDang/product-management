from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routers import status
from .dependencies.database import create_db_and_tables


@asynccontextmanager
async def lifespan(__app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Product Management API",
    description="API for managing products",
    version="0.1.0",
    contact={
        "name": "Ngoc Dang",
        "email": "ndang2319@gmail.com",
    },
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status.router)
