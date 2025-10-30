from datetime import datetime, timezone
from modules.db.models import Mutation
from modules.core.entities import MutationProcess as MutationProcess
from modules.db.repos.base_repo import BaseRepository, backup_decorator
from sqlalchemy import select
from sqlalchemy import desc

class MutationRepo(BaseRepository):
    model = Mutation
    model_core = MutationProcess

    
    def get_mutation_of_subject(self, subject_id):
        query = select(self.model).where(self.model.subject_id == subject_id).order_by(desc(self.model.created_at))
        result = self.session.execute(query)
        data = result.scalars().first()
        if data:
            data = self.get_dto_from_model(data)
        return data