from fastapi import Depends, APIRouter, Header
from typing import Optional

from modules.api.schemas.schemas import CreateSubjectSchema, CreateUserSchema, DateTimeHeader, InitiateServerSchema
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Subject, User, UserRole
from modules.core.exceptions import BaseCustomException
from modules.core.use_cases.admin_case import GetLogs, GetServerStatus
from modules.core.use_cases.base_case import UseCase, logging_decorator, UseCaseFactory
from modules.core.use_cases.subject_case import CreateSubjectCase, GetAllSubjectsCase,  UpdateSubjectCase
from modules.core.use_cases.user_case import CreateUserCase

admin_router = APIRouter(prefix="/admin")





@admin_router.post("/initiate")
async def initiate_finfalresearch(user_data: InitiateServerSchema, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams)):
    case:GetServerStatus = UseCaseFactory.get(GetServerStatus, infrastucture_params)
    result = await case.execute()
    if result["initiated"] == True:
        raise BaseCustomException("server already initiated")
    
    user_object = CreateUserSchema(
        login = user_data.login,
        name = user_data.login,
        password= user_data.password,
        role = UserRole.MASTER
    )

    case:CreateUserCase = UseCaseFactory.get(CreateUserCase, infrastucture_params)
    result = case.execute(user_object)
    return await result


@admin_router.get("/logs")
async def get_logs(not_before: Optional[DateTimeHeader] = Header(None),
        not_after: Optional[DateTimeHeader] = Header(None),
                   user: Optional[str] = Header(None),
                   action: Optional[str] = Header(None),
                   result: Optional[str] = Header(None),
                   offset: Optional[int] = Header(None, gt=-1),
                   count: Optional[int] = Header(None, gt=-1),
                   sorting_key: Optional[str] = Header(None),
                   sorting_desc: Optional[bool] = Header(None),
                   username=Depends(AuthService().has_role([]))):

    #не зависит от общей фабрики и от бд
    get_logs_case: GetLogs = GetLogs()
    result = get_logs_case.execute(not_before, not_after, user, action, result,
                                   offset, count, sorting_key, sorting_desc)
    return result