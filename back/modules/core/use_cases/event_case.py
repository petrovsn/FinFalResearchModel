from copy import deepcopy
from  datetime import timedelta, timezone, datetime
import random

from sklearn.feature_selection import mutual_info_classif
from modules.api.schemas.schemas import EventCreationScheme
from modules.bio_engine.mental_engine import MentalEngine
from modules.core.entities import Event, EventType,Subject, MakoInjection, SubjectStatus, Task, UserRole
from modules.core.exceptions import BaseCustomException, ObjectNonExists
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict
from modules.bio_engine.mako_engine import MakoEngine, TissueEvolutionData
from modules.core.use_cases.subject_case import SetSubjectStatusCase, UpdateSubjectStatsHistory
from modules.utils.config_loader import ConfigLoader
from modules.utils.logger import Logger
from modules.utils.random_generator import get_random_string
import base64

class GetEvents(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.events_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result


class CreateEvent(UseCase):
    @logging_decorator
    async def execute(self, event_data: EventCreationScheme):
        code = get_random_string(8)
        code = "I_"+code 
        if event_data.event_type == EventType.STIM:
            code = "O_"+code

        event = Event(event_type=event_data.event_type,
                      name = event_data.name,
                      description=event_data.description,
                      code = code,
                      multiple=event_data.multiple)
        
        self.events_repo.save(event)

class ImportEvents(UseCase):
    @logging_decorator
    async def execute(self, csv_data_b64: str):
        parsed_data  = [] 
        
        try:
            print(csv_data_b64)
            csv_data_bytes = base64.b64decode(csv_data_b64).decode(encoding='utf-8')
            rows = csv_data_bytes.split('\n')
            #формат данных - логин, пароль, роль
            
            for row in rows[1:]:
                if row == "": continue
                name, event_type, multiple, description = row.strip().split(';')
                print(name, event_type, multiple, description)
                parsed_data.append(EventCreationScheme(
                    event_type = event_type,
                    multiple = multiple,
                    name = name, 
                    description = description,
                ))
                
        except Exception as e:
            raise BaseCustomException("wrong table format")

        for event_data in parsed_data:
            case: CreateEvent = self.get_case(CreateEvent)
            try:
                await case.execute(event_data)
            except Exception as e:
                Logger().warning(self.request_data.login,
                                 self.request_data.url,
                                 "import events",
                                 csv_data_b64,
                                 "error", str(e))

class ExportEvents(UseCase):
    async def execute(self):
        pass

class EventActivate(UseCase):
    async def execute(self, subject_id, event_id):
        event: Event = self.events_repo.get_by_id(event_id)
        if not event: raise ObjectNonExists(event)
        event_input_case = self.get_case(EventInput)
        await event_input_case.execute(subject_id,event.code)

class EventInput(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event_code):
        event: Event = self.events_repo.get_by_code(event_code)
        if event == None: return

        subject:Subject = self.subject_repo.get_by_id(subject_id)
        event.append_user(subject.name)
        self.events_repo.update(event.id, event)

        
        class_type = ProceedStim
        if event.event_type == EventType.STORY:
            class_type = ProceedStoryPoint
        case = self.get_case(class_type)
        await case.execute(subject_id, event)
    

class ProceedStoryPoint(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event:Event):   
        pass
    
class ProceedStim(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event:Event):
        pass
