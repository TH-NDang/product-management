from fastapi import HTTPException
from supabase import create_client

from core import config


def get_supabase_client():
    url: str = config.Settings().SUPABASE_PROJECT_URL
    key: str = config.Settings().NEXT_PUBLIC_SUPABASE_ANON_KEY
    try:
        supabase = create_client(url, key)
    except Exception as exc:
        raise HTTPException(
            status_code=401, detail="Failed to create supabase client"
        ) from exc
    return supabase
