from copy import deepcopy
from  datetime import timedelta, timezone, datetime
import random

from modules.api.schemas.schemas import  StimCreationSchema
from modules.core.entities import Stim
from modules.core.exceptions import BaseCustomException, ObjectNonExists
from modules.core.use_cases.base_case import UseCase, logging_decorator

from modules.utils.logger import Logger
from modules.utils.random_generator import get_random_string
import base64

class GetStims(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.stims_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result


class CreateStim(UseCase):
    @logging_decorator
    async def execute(self, stim_data: StimCreationSchema):
        code = get_random_string(8)
        code = "I_"+code 

        stim = Stim(code=code,
                    tissue_type=stim_data.tissue_type,
                     mako_volume=stim_data.mako_volume)
        
        self.stims_repo.save(stim)

class ImportStims(UseCase):
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
                tissue_type, mako_volume = row.strip().split(';')
                parsed_data.append(StimCreationSchema(
                    tissue_type = tissue_type,
                    mako_volume=int(mako_volume)
                ))
                
        except Exception as e:
            raise BaseCustomException("wrong table format")

        for stim_data in parsed_data:
            case: CreateStim = self.get_case(CreateStim)
            try:
                await case.execute(stim_data)
            except Exception as e:
                Logger().warning(self.request_data.login,
                                 self.request_data.url,
                                 "import stims",
                                 csv_data_b64,
                                 "error", str(e))

class StimActivate(UseCase):
    async def execute(self, subject_id, stim_id):
        stim: Stim = self.stims_repo.get_by_id(stim_id)
        if not stim: raise ObjectNonExists(stim)
        stim_input_case = self.get_case(StimInput)
        await stim_input_case.execute(subject_id,stim.code)

class StimInput(UseCase):
    @logging_decorator
    async def execute(self, subject_id, stim_code):
        pass
