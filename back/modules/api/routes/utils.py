
from fastapi import Depends, APIRouter, Header, Body
from typing import Optional
import json
from modules.api.security.token_handler import AuthService
from fastapi.security import OAuth2PasswordRequestForm

from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.background.service_manager_controller import ServiceManagerController
from modules.core.use_cases.admin_case import GetServerStatus
from modules.core.use_cases.base_case import UseCase, logging_decorator,UseCaseFactory
from modules.utils.config_loader import ConfigLoader
import time

utils_router = APIRouter(prefix="/utils")


@utils_router.delete("/clear")
async def delete_all():
    pass


@utils_router.get("/status")
async def get_status(infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams)):
    case:GetServerStatus = UseCaseFactory.get(GetServerStatus, infrastucture_params)
    result = case.execute()
    return await result



@utils_router.get("/config")
async def get_config(infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
                     user_request_data=Depends(AuthService().has_role([]))):
    return ConfigLoader().config


@utils_router.post("/config")
async def get_config(config: str = Body(), infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
                     user_request_data=Depends(AuthService().has_role([]))):
    
    config = json.loads(config)
    return ConfigLoader().update(config)



@utils_router.get("/services")
async def get_services(infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
                     user_request_data=Depends(AuthService().has_role([]))):
    return ServiceManagerController().get_services_info()


@utils_router.put("/services/{service_name}/is_alive")
async def put_service_state(service_name: str, is_alive:bool = Body(), infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
                     user_request_data=Depends(AuthService().has_role([]))):
    ServiceManagerController().set_service_state(service_name, is_alive)
    time.sleep(0.2)


@utils_router.put("/services/{service_name}/timeout")
async def put_service_state(service_name: str, timeout:int = Body(), infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
                     user_request_data=Depends(AuthService().has_role([]))):
    ServiceManagerController().set_service_timeout(service_name, timeout)
    time.sleep(0.2)