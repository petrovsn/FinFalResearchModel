from fastapi import Depends, APIRouter, Header
from typing import Optional
from modules.core.entities import UserRequestInfo
from modules.api.schemas.schemas import DrugInjectionData, JenovaInjectionData, MakoInjectionData
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import MakoInjection, UserRole
from modules.core.use_cases.base_case import UseCase, logging_decorator, UseCaseFactory
from modules.core.use_cases.bio_case import GetSciLog, GetTissuesEvolutionData, InjectJenovaToSubject, InjectMakoToSubject, InjectNeuroDrugsToSubject, ProceedNextTimePhase

bio_router = APIRouter(prefix="/bio")

#Инъекции и просмотр логов могут все доктора
@bio_router.post("/inject_mako")
async def inject_mako(
    mako_injection_data: MakoInjectionData,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.DOCTOR]))):
    case: InjectMakoToSubject = UseCaseFactory.get(InjectMakoToSubject,
                                                   infrastucture_params, user_request_data)
    task_object = await case.execute(mako_injection_data.subject_id,
                       mako_injection_data.mako_injection)
    return task_object

@bio_router.post("/inject_jenova")
async def inject_jenova(
    jenova_injection_data: JenovaInjectionData,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.DOCTOR]))):
    case: InjectJenovaToSubject = UseCaseFactory.get(InjectJenovaToSubject,
                                                   infrastucture_params, user_request_data)
    await case.execute(jenova_injection_data.subject_id,
                       jenova_injection_data.jenova_cells)
    return


@bio_router.post("/inject_drugs")
async def inject_drugs(
    drug_injection_data: DrugInjectionData,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.DOCTOR]))):
    case: InjectNeuroDrugsToSubject = UseCaseFactory.get(
        InjectNeuroDrugsToSubject, infrastucture_params, user_request_data)
    await case.execute(drug_injection_data.subject_id,
                       drug_injection_data.drug_injection)
    return


@bio_router.get("/scilog")
async def get_scilogs(
        offset: Optional[int] = Header(None, gt=-1),
        count: Optional[int] = Header(None, gt=-1),
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.DOCTOR]))):
    case: GetSciLog = UseCaseFactory.get(GetSciLog, infrastucture_params, user_request_data)
    result = await case.execute(offset, count)
    return result


#Ускоренный переход на следующую фазу и просмотр дерева эволюции - мастера

@bio_router.get("/evolution")
async def get_evolution_values(
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case: GetTissuesEvolutionData = UseCaseFactory.get(GetTissuesEvolutionData,
                                                       infrastucture_params, user_request_data)
    result = await case.execute()
    return result


@bio_router.get("/next_phase")
async def next_phase(infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role([UserRole.MASTER]))):
    case: ProceedNextTimePhase = UseCaseFactory.get(ProceedNextTimePhase, infrastucture_params, user_request_data)
    await case.execute()
    return