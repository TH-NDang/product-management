from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel

from core import database


def create_db_and_tables():
    SQLModel.metadata.create_all(database.engine)


def get_session():
    with Session(database.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
