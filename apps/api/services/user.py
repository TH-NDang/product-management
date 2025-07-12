from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from core.supabase import get_supabase_client

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase = Depends(get_supabase_client),
):
    try:
        user_response = supabase.auth.get_user(credentials.credentials)
        if not user_response or not getattr(user_response, "user", None):
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Authentication failed") from exc
