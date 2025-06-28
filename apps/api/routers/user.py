from fastapi import APIRouter, Depends
from services.user import get_current_user


router = APIRouter(
    prefix="/user",
    tags=["user"],
)




@router.get("/protected-endpoint")
async def protected_route(current_user=Depends(dependency=get_current_user)):
    return {"message": f"Hello {current_user.email}"}
