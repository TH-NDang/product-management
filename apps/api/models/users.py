from sqlmodel import Field, SQLModel
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True)
    name: str
    role: str

class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    encrypted_password: str
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())
