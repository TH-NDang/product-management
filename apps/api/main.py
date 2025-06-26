from fastapi import FastAPI
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

app.include_router(status.router)
