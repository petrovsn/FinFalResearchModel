from datetime import datetime, timezone

from pydantic import BaseModel
from modules.db.models import Mutation
from modules.core.entities import Mutation as MutationCore
from modules.db.repos.base_repo import BaseRepository, backup_decorator
from sqlalchemy import select
from sqlalchemy import desc

class MutationRepo(BaseRepository):
    model = Mutation
    model_core = MutationCore


    def get_dto_from_model(self, model_obj):
        if model_obj == None: return None
        model_dict = model_obj.to_dict()
        model_dict["conditions"] = model_dict["conditions"].split(',')
        return self.model_core(**model_dict)
    
    def get_model_dict_from_dto(self, model_dto:BaseModel):
        result = model_dto.model_dump()
        result["conditions"] = ','.join(result["conditions"])
        #result = model_dto.model_dump_json()
        #for key in ["created_at", "supression_start"]:
        #    if  key in result:
        #        result[key] = datetime.strptime(result[key])
        return result