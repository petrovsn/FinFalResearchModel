from modules.core.entities import User as UserCore
from modules.db.repos.base_repo import BaseRepository
from modules.db.models import User
from sqlalchemy import select

class UserRepo(BaseRepository):
    model = User
    model_core = UserCore

    def get_by_login(self, user_login):
        query = select(self.model).where(self.model.login == user_login)
        result = self.session.execute(query)
        model_obj = result.scalars().first()
        return self.get_dto_from_model(model_obj)
    
    def get_by_name(self, name):
        query = select(self.model).where(self.model.name == name)
        result = self.session.execute(query)
        model_obj = result.scalars().first()
        return self.get_dto_from_model(model_obj)
    
    def get_by_role(self, role):
        query = select(self.model).where(self.model.role == role)    
        result = self.session.execute(query)
        output = [self.get_dto_from_model(a) for a in result.scalars()]
        return output

