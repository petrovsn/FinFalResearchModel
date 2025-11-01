from fastapi import Body, Depends, APIRouter, Header
from typing import Optional

from modules.api.schemas.schemas import MutationSupressionResult
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import UserRequestInfo
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.mutations_case import GetAllMutProcess, GetRemainigMutProcessSeconds,  RunMutProcessSupressing, SetMutProcessResult

mut_process_router = APIRouter(prefix="/mut_process")


@mut_process_router.get("")
async def get_mutation_processes(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetAllMutProcess = UseCaseFactory.get(GetAllMutProcess, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result


@mut_process_router.put("/{mutation_id}/run_supression")
async def run_supression(mutation_id,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:RunMutProcessSupressing = UseCaseFactory.get(RunMutProcessSupressing, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id)
    return result

@mut_process_router.get("/{mutation_id}/seconds_remain")
async def seconds_remain(mutation_id,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetRemainigMutProcessSeconds = UseCaseFactory.get(GetRemainigMutProcessSeconds, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id)
    return result

@mut_process_router.put("/{mutation_id}/supression_result")
async def supression_result(mutation_id,
                        supression_result: MutationSupressionResult,
                        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                       user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:SetMutProcessResult = UseCaseFactory.get(SetMutProcessResult, infrastucture_params, user_request_data)
    result = await case.execute(mutation_id, supression_result.success_points, supression_result.confirmation_code)
    return result

