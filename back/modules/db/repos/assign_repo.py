
from sqlalchemy import select
from modules.core.entities import SubjectAssignment as SubjectAssignmentCore
from modules.db.repos.base_repo import BaseRepository
from modules.db.models import Subject, SubjectAssignment
import json

class AssignRepo(BaseRepository):
    model = SubjectAssignment
    model_core = SubjectAssignmentCore

    def get_assigned_to(self, doctor_id):
        query = select(self.model).where(self.model.doctor_id == doctor_id)
        result = self.session.execute(query)
        output = [self.get_dto_from_model(a) for a in result.scalars()]
        return output

