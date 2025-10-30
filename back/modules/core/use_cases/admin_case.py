import random
from modules.bio_engine.mental_engine import MentalEngine
from modules.core.entities import MakoEnergy, Subject, MakoInjection, SubjectStatus, Task, User, UserRole
from modules.core.exceptions import BaseCustomException
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict

from modules.bio_engine.mako_engine import MakoEngine, TissueEvolutionData
from modules.utils.config_loader import ConfigLoader
from modules.utils.logger import Logger
import os
import shutil


class GetServerStatus(UseCase):
    async def execute(self):
        masters: List[User] = self.users_repo.get_by_role(UserRole.MASTER)
        if masters == []:
            return {
                "initiated":False
            }
        
        return {
                "initiated":True
            }
        

class GetLogs:
    def execute(self, not_before, not_after, user, action, result, offset, count, sorting_key, sorting_desc ):
        output = Logger().get_logs(not_before, not_after, user, action, result, offset, count, sorting_key, sorting_desc )
        return output
    

