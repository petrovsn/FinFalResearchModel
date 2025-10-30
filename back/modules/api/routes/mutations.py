from fastapi import Body, Depends, APIRouter, Header
from typing import Optional

from modules.api.schemas.schemas import CreateSubjectSchema, MutationSupressionResult
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Subject, SubjectStatus, UserRole
from modules.core.entities import UserRequestInfo
from modules.core.use_cases.base_case import UseCase, logging_decorator,UseCaseFactory
from modules.core.use_cases.mutations_case import GetAllMutatutions, GetCurrentMutation, GetRemainigSeconds, RunMutationSupressing, SetMutatuionResult
from modules.core.use_cases.subject_case import CreateSubjectCase, GetAllSubjectsCase, GetAvailableSubject, GetSubjectInfoCase, GetSubjectStatsHistory, SetSubjectStatusCase, UpdateSubjectCase
from modules.core.use_cases.task_case import GetActualTask

mutations_router = APIRouter(prefix="/mutations")


@mutations_router.get("")
async def get_mutations(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetAllMutatutions = UseCaseFactory.get(GetAllMutatutions, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result


@mutations_router.put("/{mutation_id}/run_supression")
async def run_supression(mutation_id,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:RunMutationSupressing = UseCaseFactory.get(RunMutationSupressing, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id)
    return result

@mutations_router.get("/{mutation_id}/seconds_remain")
async def seconds_remain(mutation_id,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetRemainigSeconds = UseCaseFactory.get(GetRemainigSeconds, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id)
    return result

@mutations_router.put("/{mutation_id}/supression_result")
async def supression_result(mutation_id,
                        supression_result: MutationSupressionResult,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:SetMutatuionResult = UseCaseFactory.get(SetMutatuionResult, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id, supression_result.success_points, supression_result.confirmation_code)
    return result

