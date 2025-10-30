from asyncio import get_event_loop, create_task
from threading import Thread
from modules.background.services.base_service import BackgroundServiceBase

from typing import Dict

from modules.background.services.db_backuper import DbBackuper
from modules.background.services.mutation_checker import MutationChecker
from modules.background.services.phase_shifter import PhaseShifter
from modules.background.services.subject_status_updater import SubjectOnRestStatusUpdater



    
    

class ServiceManager:
    def __init__(self):
        self.services: Dict[str, BackgroundServiceBase] = {
            "DbBackuper":DbBackuper(),
            "PhaseShifter":PhaseShifter(),
            "SubjectOnRestStatusUpdater": SubjectOnRestStatusUpdater(),
            "MutationChecker": MutationChecker()
        }

    async def run(self):
        for key in self.services:
            create_task(self.services[key].start())

    async def stop(self):
        for key in self.services:
            await self.services[key].stop()