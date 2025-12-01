from datetime import datetime, timezone
from modules.db.models import EventTrackingTable
from modules.core.entities import Event as EventCore
from modules.db.repos.base_repo import BaseRepository, backup_decorator
from sqlalchemy import select
from sqlalchemy import desc
import json

class EventTrackingRepo(BaseRepository):
    model = EventTrackingTable

    def get(self):
        pass

    def save(self, data_event):
        pass
    
