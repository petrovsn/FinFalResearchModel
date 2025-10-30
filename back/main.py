import uvicorn
from modules.api.app import app
import asyncio
from modules.utils.config_loader import ConfigLoader

if __name__ == '__main__':
    #syncio.run(create_db_tables())
    app_port = ConfigLoader().get_app_port()
    # Приложение может запускаться командой
    # `uvicorn main:app --host 0.0.0.0 --port 8080 --app-dir src`
    # но чтобы не терять возможность использовать дебагер,
    # запустим uvicorn сервер через python
    uvicorn.run(
        'main:app',
        host="0.0.0.0",
        port=app_port, 
    )
