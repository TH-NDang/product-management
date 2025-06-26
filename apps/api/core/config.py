"""Configuration and settings management for the API application."""

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = Field(default="", description="Database URL")
    JWT_SECRET_KEY: str = Field(default="", description="JWT Secret Key")
    ALGORITHM: str = Field(default="HS256", description="Algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60, description="Access Token Expire Minutes"
    )

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    """Return cached Settings instance."""
    return Settings()
