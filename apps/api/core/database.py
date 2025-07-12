from fastapi import Depends
from typing import Annotated
from sqlmodel import SQLModel, Session, create_engine

from core.config import get_settings

# Why use it: https://sqlmodel.tiangolo.com/tutorial/create-db-and-table/#sqlmodel-metadata-order-matters
from models import tables

# This will suppress the linter warning while keeping the import for its side effects.
_ = tables

database_url = get_settings().DATABASE_URL
engine = create_engine(database_url, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


SessionDep = Annotated[Session, Depends(get_session)]
