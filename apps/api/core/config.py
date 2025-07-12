"""Configuration and settings management for the API application."""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = Field(default="sqlite:///./product_management.db", description="Database URL")
    JWT_SECRET_KEY: str = Field(default="your-secret-key-here", description="JWT Secret Key")
    ALGORITHM: str = Field(default="HS256", description="Algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60, description="Access Token Expire Minutes"
    )
    SUPABASE_JWT_SECRET: str = Field(default="", description="Supabase JWT Secret")
    SUPABASE_DB_URL: str = Field(default="", description="Supabase DB URL")
    SUPABASE_PROJECT_URL: str = Field(default="", description="Supabase Project URL")
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = Field(
        default="", description="Supabase Anon Key"
    )

    model_config = SettingsConfigDict(env_file=".env")
