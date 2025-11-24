from datetime import datetime, timezone
from modules.db.models import Stim
from modules.core.entities import Stim as StimCore
from modules.db.repos.base_repo import BaseRepository
from sqlalchemy import select
from sqlalchemy import desc
import json

class StimsRepo(BaseRepository):
    model = Stim
    model_core = StimCore

    def get_by_code(self, code):
        query = select(self.model).where(self.model.code == code)
        result = self.session.execute(query)
        data = result.scalars().first()
        if data:
            data = self.get_dto_from_model(data)
        return data