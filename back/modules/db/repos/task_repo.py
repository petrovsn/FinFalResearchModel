import json
from sqlalchemy import select
from modules.core.entities import Task as TaskCore, MakoInjection
from modules.db.models import Task
from modules.db.repos.base_repo import BaseRepository


class TaskRepo(BaseRepository):
    model = Task
    model_core = TaskCore

    def get_dto_from_model(self, model_obj:Task) -> TaskCore:
        if model_obj == None: return None
        return TaskCore(
            id = model_obj.id,
            subject_id=model_obj.subject_id,
            subject_name = model_obj.subject_name,
            m_injection = MakoInjection.model_validate_json(model_obj.m_injection),
            task_numbers = json.loads(model_obj.task_numbers),
            input_numbers  = json.loads(model_obj.input_numbers),
            created_at= model_obj.created_at,
            status= model_obj.status,
            complexity = model_obj.complexity,
            f1_score = model_obj.f1_score
        )
    
    def get_model_dict_from_dto(self, model_dto:TaskCore):
        return  {
            "subject_id":model_dto.subject_id,
            "subject_name": model_dto.subject_name,
            "status":model_dto.status,
            "m_injection":model_dto.m_injection.model_dump_json(),
            "task_numbers":json.dumps(model_dto.task_numbers),
            "input_numbers":json.dumps(model_dto.input_numbers),
            "created_at": model_dto.created_at,
            "complexity": model_dto.complexity,
            "f1_score":model_dto.f1_score
        }
    
    def get_active_for_subject(self, subject_id:int):
        query = select(self.model).where(self.model.subject_id == subject_id).where(self.model.status=="active")
        result = self.session.execute(query)
        model_obj = result.scalar()
        #model_obj.data = subject_data.model_dump_json()
        self.session.commit()
        return self.get_dto_from_model(model_obj)