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

    def _datetime_handler(self, obj):
            """Обработчик для сериализации datetime в JSON"""
            if isinstance(obj, datetime):
                return obj.isoformat()
            raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

    def _parse_datetime_dict(self, data: dict) -> dict:
        """Парсинг словаря с преобразованием строк в datetime"""
        parsed = {}
        for key, dates in data.items():
            parsed[key] = [datetime.fromisoformat(date_str) for date_str in dates]
        return parsed

    def get_dto_from_model(self, model_obj):
        if model_obj is None: 
            return None
            
        model_dict = model_obj.to_dict()
        # Десериализуем subjects с преобразованием строк в datetime
        if model_dict.get("subjects"):
            model_dict["subjects"] = self._parse_datetime_dict(
                json.loads(model_dict["subjects"])
            )
        else:
            model_dict["subjects"] = {}
            
        return self.model_core(**model_dict)
    
    def get_model_dict_from_dto(self, model_dto):
        result = super().get_model_dict_from_dto(model_dto)
        # Сериализуем subjects с обработкой datetime
        result["subjects"] = json.dumps(
            result["subjects"], 
            default=self._datetime_handler,
            ensure_ascii=False
        )
        return result
    
    def get_by_code(self, code):
        query = select(self.model).where(self.model.code == code)
        result = self.session.execute(query)
        data = result.scalars().first()
        if data:
            data = self.get_dto_from_model(data)
        return data