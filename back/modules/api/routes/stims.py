from fastapi import Body, Depends, APIRouter, Header
from typing import Optional
from modules.api.schemas.schemas import CsvImportData, StimCreationSchema
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Subject, SubjectStatus, UserRole
from modules.core.entities import UserRequestInfo
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.stims_case import CreateStim, StimActivate, GetStims, ImportStims

stims_router = APIRouter(prefix="/stims")

@stims_router.get("")
async def get_stims(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),

    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
    user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case:GetStims = UseCaseFactory.get(GetStims, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result

@stims_router.post("")
async def create_stim(
        stim_data: StimCreationSchema,
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
        user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    
    case:CreateStim = UseCaseFactory.get(CreateStim, infrastucture_params, user_request_data)
    result = await case.execute(stim_data)


"""@stims_router.put("")
async def activate_stim(
        stim_data: StimActivationScheme,
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
        user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    
    case:StimActivate = UseCaseFactory.get(StimActivate, infrastucture_params, user_request_data)
    result = await case.execute(stim_data.subject_id, stim_data.stim_id)"""


@stims_router.post("/import")
async def import_users(stimsimportdata: CsvImportData, 
                   infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                   user_request_data=Depends(AuthService().has_role([UserRole.MASTER]))):
    case:ImportStims = UseCaseFactory.get(ImportStims,  infrastucture_params, user_request_data)
    await case.execute(stimsimportdata.csv_data)
    return