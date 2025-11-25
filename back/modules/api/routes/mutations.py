from fastapi import Body, Depends, APIRouter, Header
from typing import Optional

from modules.api.schemas.schemas import CsvImportData, MutationCreationScheme, MutationSupressionResult
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import UserRequestInfo, UserRole
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.mutations_case import CreateMutation, GetAllMutations, ImportMutations

mutations_router = APIRouter(prefix="/mutations")


@mutations_router.get("")
async def get_mutations(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case:GetAllMutations = UseCaseFactory.get(GetAllMutations, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result



@mutations_router.post("")
async def post_mutation(
    mut_data: MutationCreationScheme,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):

    case:CreateMutation = UseCaseFactory.get(CreateMutation, infrastucture_params, user_request_data)
    result = case.execute(mut_data)
    return await result


@mutations_router.post("/import")
async def import_mutations(
    mutationsimportdata: CsvImportData,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case:ImportMutations = UseCaseFactory.get(ImportMutations, infrastucture_params, user_request_data)
    result = case.execute(mutationsimportdata.csv_data)
    return await result

