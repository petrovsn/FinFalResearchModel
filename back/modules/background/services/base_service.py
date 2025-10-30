import asyncio

from modules.background.service_manager_controller import ServiceManagerController
from modules.utils.logger import Logger


class BackgroundServiceBase:
    def __init__(self):
        self._task = None


    async def execution_loop(self) -> None:
        while self._is_running:
            is_alive = ServiceManagerController().is_alive(self.__class__.__name__)
            if is_alive:
                try:
                    await self.execute()
                except Exception as e:
                    Logger().critical("system", "localhost", self.__class__.__name__+".execute", "", "exception", str(e))

            timeout = ServiceManagerController().get_timeout(self.__class__.__name__)
            await asyncio.sleep(timeout)

    async def execute(self):
        pass

    async def start(self) -> None:
        self._is_running = True
        self._task = asyncio.create_task(self.execution_loop())

    async def stop(self) -> None:
        self._is_running = False
        if self._task:
            await self._task