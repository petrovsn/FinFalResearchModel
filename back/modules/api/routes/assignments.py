from fastapi import Depends, APIRouter, Header,Body
from typing import Optional
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import UserRequestInfo, UserRole
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.subject_case import GetAssignmentsCase, SetAssignmetCase

assignment_router = APIRouter(prefix="/assignments")


@assignment_router.get("")
async def get_assignments(infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                          user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.SENIOR]))):
    case:GetAssignmentsCase = UseCaseFactory.get(GetAssignmentsCase, infrastucture_params, user_request_data)
    if user_request_data.role == UserRole.MASTER:
        result = case.execute(None)
    else:
        result = case.execute(user_request_data.login)
    return await result




@assignment_router.put("")
async def put_assignment(
    subject_name: Optional[str] = Body(None),
    doctor_name: Optional[str] = Body(None),
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.SENIOR]))):

    case: SetAssignmetCase = UseCaseFactory.get(SetAssignmetCase, infrastucture_params, user_request_data)
    result = await case.execute(subject_name,doctor_name)
    return 
