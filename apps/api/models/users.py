from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: str = Field(unique=True)
    name: str
    role: str

