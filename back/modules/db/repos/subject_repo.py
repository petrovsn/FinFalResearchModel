
from sqlalchemy import select
from modules.core.entities import Subject as SubjectCore
from modules.db.repos.base_repo import BaseRepository
from modules.db.models import Subject
import json

class SubjectRepo(BaseRepository):
    model = Subject

    def get_dto_from_model(self, model_obj:Subject) -> SubjectCore:
        if model_obj == None: return None
        subject_obj = SubjectCore.model_validate_json(model_obj.data)
        subject_obj.id = model_obj.id
        return subject_obj
    
    def get_model_dict_from_dto(self, model_dto:SubjectCore):
        return  {
            "data":model_dto.model_dump_json(),
            "name":model_dto.name,
            "status": model_dto.status
        }

