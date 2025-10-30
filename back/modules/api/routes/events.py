from fastapi import Body, Depends, APIRouter, Header
from typing import Optional
from modules.api.schemas.schemas import EventCreationScheme
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Subject, SubjectStatus, UserRole
from modules.core.entities import UserRequestInfo
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.event_case import CreateEvent, GetEvents

events_router = APIRouter(prefix="/events")

@events_router.get("")
async def get_events(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetEvents = UseCaseFactory.get(GetEvents, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result

@events_router.post("")
async def create_event(
        event_data: EventCreationScheme,
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
        user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    
    case:CreateEvent = UseCaseFactory.get(CreateEvent, infrastucture_params, user_request_data)
    result = await case.execute(event_data)