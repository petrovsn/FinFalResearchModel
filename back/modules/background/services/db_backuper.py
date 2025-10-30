
from modules.background.services.base_service import BackgroundServiceBase
from modules.db.engine import BackupDB

class DbBackuper(BackgroundServiceBase):
    async def execute(self):
        BackupDB().execute("on_timeout")