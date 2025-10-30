# src/api/dependencies.py
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from jose import jwt
from datetime import datetime, timedelta
from modules.assembler.assembler import get_InfrastuctureAssemblyParams

from modules.core.entities import UserRequestInfo, UserRole
from modules.core.use_cases.base_case import UseCase, logging_decorator,UseCaseFactory
from modules.core.use_cases.user_case import GetUserInfoCase


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


class AuthService:
    SECRET_KEY = "your-secret-key"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 3000

    def create_access_token(self,
                            login: str,
                            expires_delta: timedelta = None) -> str:
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days = 1)
        to_encode = {"sub": login, "exp": expire}
        return jwt.encode(to_encode,
                          AuthService.SECRET_KEY,
                          algorithm=AuthService.ALGORITHM)

    def has_role(self, roles):

        async def role_checker(request: Request, token: str = Depends(oauth2_scheme), infrastucture_params: dict = Depends(get_InfrastuctureAssemblyParams)):
            url = request.client.host
            username = None
            try:
                payload = jwt.decode(token,
                                     AuthService.SECRET_KEY,
                                     algorithms=[AuthService.ALGORITHM])
                username = payload["sub"]
            except JWTError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token",
                )

            get_user_info_case: GetUserInfoCase = UseCaseFactory.get(
                GetUserInfoCase, infrastucture_params)
            
            user_info = await get_user_info_case.execute(username)
            if roles!=None:
                if user_info.role not in roles+[UserRole.MASTER]:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Access denied",
                    )
                
            return UserRequestInfo(login = username, url = url, role=user_info.role, name = user_info.name)
        return role_checker
