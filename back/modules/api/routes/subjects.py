from fastapi import Body, Depends, APIRouter, Header
from typing import Optional

from modules.api.schemas.schemas import CreateSubjectSchema
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Subject, SubjectStatus, UserRole
from modules.core.entities import UserRequestInfo
from modules.core.use_cases.base_case import UseCase, logging_decorator,UseCaseFactory
from modules.core.use_cases.mutations_case import GetAvailableMutationsForSubject, GetCurrentMutProcess
from modules.core.use_cases.subject_case import CreateSubjectCase, GetAllSubjectsCase, GetAvailableSubject, GetSubjectInfoCase, GetSubjectStatsHistory, SetSubjectStatusCase, UpdateSubjectCase
from modules.core.use_cases.task_case import GetActualTask

subject_router = APIRouter(prefix="/subjects")


@subject_router.get("")
async def get_subjects(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetAllSubjectsCase = UseCaseFactory.get(GetAllSubjectsCase, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result

@subject_router.get("/{subject_id}/info")
async def get_subject_info(subject_id: int, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case:GetSubjectInfoCase = UseCaseFactory.get(GetSubjectInfoCase, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id)
    return result


@subject_router.put("/{subject_id}")
async def update_subject(subject_id: int, subject_data: Subject, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case:UpdateSubjectCase = UseCaseFactory.get(UpdateSubjectCase, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id, subject_data)
    return result


@subject_router.put("/{subject_id}/status")
async def set_subject_status(subject_id: int, subject_status: SubjectStatus = Body(None), infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case:SetSubjectStatusCase = UseCaseFactory.get(SetSubjectStatusCase, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id, subject_status)
    return result

@subject_router.get("/{subject_id}/stats_history")
async def set_subject_status(subject_id: int, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER, UserRole.DOCTOR, UserRole.SENIOR]))):
    case:GetSubjectStatsHistory = UseCaseFactory.get(GetSubjectStatsHistory, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id)
    return result


@subject_router.get("/{subject_id}/actual_task")
async def get_actual_task(subject_id: int, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER, UserRole.DOCTOR]))):
    case: GetActualTask = UseCaseFactory.get(GetActualTask, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id)
    return result


@subject_router.get("/{subject_id}/available_mutations")
async def get_actual_task(subject_id: int, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER, UserRole.DOCTOR]))):
    case: GetAvailableMutationsForSubject = UseCaseFactory.get(GetAvailableMutationsForSubject, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id)
    return result

@subject_router.get("/{subject_id}/actual_mutation_process")
async def get_actual_task(subject_id: int, infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER, UserRole.DOCTOR]))):
    case: GetCurrentMutProcess = UseCaseFactory.get(GetCurrentMutProcess, infrastucture_params, user_request_data)
    result =  await case.execute(subject_id)
    return result


@subject_router.get("/available")
async def get_available_subjects(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetAvailableSubject = UseCaseFactory.get(GetAvailableSubject, infrastucture_params, user_request_data)
    result = case.execute(user_request_data.role, user_request_data.login, filters, offset, count, sorting_key, sorting_desc)
    return await result
