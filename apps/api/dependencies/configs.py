from functools import lru_cache

from api.core import config


@lru_cache
def get_settings() -> config.Settings:
    """Return cached Settings instance."""
    return config.Settings()
