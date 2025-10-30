from modules.core.entities import StatsHistory as StatsHistoryCore
from modules.db.repos.base_repo import BaseRepository
from modules.db.models import StatsHistory
from sqlalchemy import select
from sqlalchemy import desc

class StatsHistoryRepo(BaseRepository):
    model = StatsHistory
    model_core = StatsHistoryCore
        

    def get_last_record(self, subject_id):
        query = select(self.model).where(self.model.subject_id == subject_id).order_by(desc(self.model.created_at))
        result = self.session.execute(query)
        data = result.scalars().first()
        if data:
            data = self.get_dto_from_model(data)
        return data

        

    

