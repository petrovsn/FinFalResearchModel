from copy import deepcopy
from  datetime import timedelta, timezone, datetime
import random

from sklearn.feature_selection import mutual_info_classif
from modules.api.schemas.schemas import EventCreationScheme
from modules.bio_engine.mental_engine import MentalEngine
from modules.core.entities import Event, EventType, MakoEnergy, MemoriesData, MutationClass, MutationProcess, MutationStatus, Subject, MakoInjection, SubjectStatus, Task, UserRole
from modules.core.exceptions import BaseCustomException, ObjectNonExists
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict
from modules.bio_engine.mako_engine import MakoEngine, TissueEvolutionData
from modules.core.use_cases.subject_case import SetSubjectStatusCase, UpdateSubjectStatsHistory
from modules.utils.config_loader import ConfigLoader
from modules.utils.random_generator import get_random_string

class GetEvents(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.events_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result


class CreateEvent(UseCase):
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
    async def execute(self):
        pass

class ExportEvents(UseCase):
    async def execute(self):
        pass


class EventInput(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event_code):
        event_code: Event = self.events_repo.get_by_code(event_code)
        if event_code == None: return
        class_type = ProceedStim
        if event_code.code_type == EventType.STORY:
            class_type = ProceedStoryPoint
        case = self.get_case(class_type)
        await case.execute(subject_id, event_code)
    

class ProceedStoryPoint(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event_code:Event):
        pass
    
class ProceedStim(UseCase):
    @logging_decorator
    async def execute(self, subject_id, event_code:Event):
        pass