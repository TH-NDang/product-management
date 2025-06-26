from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import status


app = FastAPI(
    title="Product Management API",
    description="API for managing products",
    version="0.1.0",
    contact={
        "name": "Ngoc Dang",
        "email": "ndang2319@gmail.com",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status.router)
