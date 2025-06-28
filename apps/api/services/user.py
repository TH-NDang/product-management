from fastapi import Depends, HTTPException
from core import config
from supabase import create_client, Client
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


def get_supabase_client() -> Client:
    url: str = config.Settings().SUPABASE_PROJECT_URL
    key: str = config.Settings().NEXT_PUBLIC_SUPABASE_ANON_KEY
    try:
        supabase = create_client(url, key)
    except Exception as exc:
        raise HTTPException(
            status_code=401, detail="Failed to create supabase client"
        ) from exc
    return supabase


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase_client),
):
    try:
        user_response = supabase.auth.get_user(credentials.credentials)
        if not user_response or not getattr(user_response, "user", None):
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Authentication failed") from exc
