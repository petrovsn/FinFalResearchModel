import base64
import random

from modules.utils.logger import Logger
from modules.api.schemas.schemas import CreateUserSchema
from modules.bio_engine.mental_engine import MentalEngine
from modules.core.entities import MakoEnergy, Subject, MakoInjection, SubjectAssignment, SubjectStatus, Task, User, UserRole
from modules.core.exceptions import BaseCustomException
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict

from modules.bio_engine.mako_engine import MakoEngine, TissueEvolutionData


class VerifyPassword(UseCase):
    async def execute(self, user_login, user_password):
        user_obj: User|None = self.users_repo.get_by_login(user_login)
        if (not user_obj): raise Exception("no such user")
        if user_obj.password == user_password:
            return True
        return False

class GetAllUsersCase(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        data = self.users_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return data
    
class GetUsersWithRoleCase(UseCase):
    async def execute(self, role):
        data =[]
        data_tmp: List[User] = self.users_repo.get()
        for user in data_tmp:
            if user.role == role:
                data.append(user.role)
        return data
    
class GetUserInfoCase(UseCase):
    async def execute(self, login):
        data = self.users_repo.get_by_login(login)
        return data

class CreateUserCase(UseCase):
    @logging_decorator
    async def execute(self, user_data: CreateUserSchema):
        user_obj: User|None = self.users_repo.get_by_login(user_data.login)
        if user_obj:
            raise BaseCustomException("user already exists")
        
        subject_id = None
        if user_data.role != UserRole.MASTER:
            subject_obj = Subject(name = user_data.name)
            subject_id = self.subject_repo.save(subject_obj)

        user_obj = User(
            login = user_data.login,
            password = user_data.password,
            name = user_data.name,
            role = user_data.role,
            subject_id=subject_id
        )

        user_id  = self.users_repo.save(user_obj)

        if subject_id!=None:
            assign_obj = SubjectAssignment(
                subject_id=subject_id,
                subject_name=user_data.name
            )
            assign_id = self.assign_repo.save(assign_obj)

        return user_id


class UpdateUserCase(UseCase):
    @logging_decorator
    async def execute(self, user_login, user_data: User):
        user_obj: None|User = self.users_repo.get_by_login(user_login)
        if not user_obj: raise BaseCustomException("no such user")
        self.users_repo.update(user_obj.id, user_data)
        subject_obj = self.subject_repo.get_by_id(user_obj.subject_id)
        subject_obj.name = user_data.name
        self.subject_repo.update(subject_obj.id, subject_obj)

class ImportUsersFromCsv(UseCase):
    @logging_decorator
    async def execute(self, csv_data_b64: str):
        parsed_data  = [] 
        
        try:
            print(csv_data_b64)
            csv_data_bytes = base64.b64decode(csv_data_b64).decode()
            rows = csv_data_bytes.split('\n')
            #формат данных - логин, пароль, роль
            
            for row in rows[1:]:
                if row == "": continue
                login, password, name, role = row.strip().split(';')
                role = UserRole(role)
                if role not in UserRole:
                    raise BaseCustomException("wrong table format")
                parsed_data.append(CreateUserSchema(
                    login = login,
                    name = name, 
                    password = password,
                    role = role)
                    )

            
        except Exception as e:
            raise BaseCustomException("wrong table format")

        for user_data in parsed_data:
            case: CreateUserCase = CreateUserCase(**self.get_infrastructure_copy())
            try:
                
                await case.execute(user_data)
            except Exception as e:
                Logger().warning(self.request_data.login,
                                 self.request_data.url,
                                 "import users",
                                 csv_data_b64,
                                 "error", str(e))