from sqlmodel import SQLModel

from api.core import database


def create_db_and_tables():
    SQLModel.metadata.create_all(database.engine)
