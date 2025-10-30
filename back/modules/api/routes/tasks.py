from fastapi import Depends, APIRouter, Header
from typing import Optional
from modules.core.entities import UserRequestInfo
from modules.api.schemas.schemas import MakoAssimilationChallengerResult, MakoTaskStatus
from modules.api.security.token_handler import AuthService
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import Task
from modules.core.use_cases.base_case import UseCase, logging_decorator, UseCaseFactory
from modules.core.use_cases.task_case import GetTasks, ComplyTask, SetTaskStatus

task_router = APIRouter(prefix="/tasks")


@task_router.get("")
async def get_tasks(
        filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case: GetTasks = UseCaseFactory.get(GetTasks, infrastucture_params, user_request_data)
    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result


@task_router.put("/{task_id}")
async def put_task_status(task_id:int,
    task_status: MakoTaskStatus,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case: SetTaskStatus = UseCaseFactory.get(SetTaskStatus, infrastucture_params, user_request_data)
    result = case.execute(task_id, task_status.task_status)
    return await result

@task_router.post("/comply")
async def post_comply_task(
    mako_assim_challege: MakoAssimilationChallengerResult,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), user_request_data:UserRequestInfo = Depends(AuthService().has_role(None))):
    case: ComplyTask = UseCaseFactory.get(ComplyTask, infrastucture_params, user_request_data)
    result = case.execute(mako_assim_challege.subject_id, mako_assim_challege.input_numbers)
    return await result

