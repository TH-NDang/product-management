from sqlmodel import create_engine

from dependencies.configs import get_settings

# Why use it: https://sqlmodel.tiangolo.com/tutorial/create-db-and-table/#sqlmodel-metadata-order-matters
from models import projects, teams, tasks

# This will suppress the linter warning while keeping the import for its side effects.
_ = projects, teams, tasks

database_url = get_settings().DATABASE_URL
engine = create_engine(database_url, echo=True)
