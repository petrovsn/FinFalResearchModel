from datetime import datetime, timezone
from modules.db.models import Event
from modules.core.entities import Event as EventCore
from modules.db.repos.base_repo import BaseRepository, backup_decorator
from sqlalchemy import select
from sqlalchemy import desc
import json

class EventsRepo(BaseRepository):
    model = Event
    model_core = EventCore

    def get_dto_from_model(self, model_obj):
        if model_obj == None: return None
        model_dict = model_obj.to_dict()
        model_dict["subjects"] = json.loads(model_dict["subjects"])
        return self.model_core(**model_dict)
    
    def get_model_dict_from_dto(self, model_dto):
        result = super().get_model_dict_from_dto(model_dto)
        result["subjects"] = json.dumps(result["subjects"])
        return result
    
    def get_by_code(self, code):
        query = select(self.model).where(self.model.code == code)
        result = self.session.execute(query)
        data = result.scalars().first()
        if data:
            data = self.get_dto_from_model(data)
        return data