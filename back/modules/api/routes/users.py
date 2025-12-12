from fastapi import Depends, APIRouter, Header
from typing import Optional
import json
from modules.api.schemas.schemas import CreateUserSchema, CsvImportData
from modules.assembler.assembler import get_InfrastuctureAssemblyParams
from modules.core.entities import User, UserRole
from modules.core.use_cases.base_case import UseCase, logging_decorator, UseCaseFactory
from modules.core.use_cases.user_case import CreateUserCase, GetAllUsersCase, GetUserInfoCase, ImportUsersFromCsv, UpdateUserCase, VerifyPassword
from modules.api.security.token_handler import AuthService
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

user_router = APIRouter(prefix="/users")


@user_router.post("/login")
async def post_login(
    form_data: Annotated[OAuth2PasswordRequestForm,
                         Depends()],
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams)):
    case: VerifyPassword = UseCaseFactory.get(VerifyPassword,
                                              infrastucture_params)
    result = await case.execute(form_data.username, form_data.password)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = AuthService().create_access_token(form_data.username)
    case: GetUserInfoCase = UseCaseFactory.get(GetUserInfoCase,
                                               infrastucture_params)
    userinfo: User = await case.execute(form_data.username)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": userinfo.role
    }


@user_router.get("")
async def get_users(
    filters: Optional[str] = Header(None),
    offset: Optional[int] = Header(None, gt=-1),
    count: Optional[int] = Header(None, gt=-1),
    sorting_key: Optional[str] = Header(None),
    sorting_desc: Optional[bool] = Header(None),
        infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
        user_request_data=Depends(AuthService().has_role([UserRole.MASTER, UserRole.SENIOR]))):
    case: GetAllUsersCase = UseCaseFactory.get(GetAllUsersCase,
                                               infrastucture_params,
                                               user_request_data)
    if filters:
        filters = json.loads(filters)

    result = case.execute(filters, offset, count, sorting_key, sorting_desc)
    return await result


@user_router.post("")
async def create_user(
    user_data: CreateUserSchema,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
    user_request_data=Depends(AuthService().has_role([UserRole.MASTER]))):
    case: CreateUserCase = UseCaseFactory.get(CreateUserCase,
                                              infrastucture_params,
                                              user_request_data)
    result = await case.execute(user_data)

@user_router.put("/{user_login}")
async def put_change_user(
    user_login: str,
    user_data: User,
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
    user_request_data=Depends(AuthService().has_role([UserRole.MASTER]))):
    case: UpdateUserCase = UseCaseFactory.get(UpdateUserCase,infrastucture_params,
                                               user_request_data)
    result = case.execute(user_login, user_data)
    return await result

@user_router.put("/my_profile")
async def get_my_profile(
    infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams),
    user_request_data=Depends(AuthService().has_role(None))):
    case: UpdateUserCase = UseCaseFactory.get(UpdateUserCase,infrastucture_params,
                                               user_request_data)
    result = case.execute(user_login, user_data)
    return await result

@user_router.post("/import")
async def import_users(userimportdata: CsvImportData, 
                   infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams), 
                   user_request_data=Depends(AuthService().has_role([UserRole.MASTER]))):
    case:ImportUsersFromCsv = UseCaseFactory.get(ImportUsersFromCsv,  infrastucture_params, user_request_data)
    await case.execute(userimportdata.csv_data)
    return
