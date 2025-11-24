from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from modules.api.middleware.exception_catcher import exception_catcher
from modules.background.service_manager import ServiceManager
from fastapi.middleware.cors import CORSMiddleware
from modules.api.routes.utils import utils_router
from modules.api.routes.subjects import subject_router
from modules.api.routes.bio import bio_router
from modules.api.routes.tasks import task_router
from modules.api.routes.users import user_router
from modules.api.routes.admin import admin_router
from modules.api.routes.assignments import assignment_router
from modules.api.routes.mut_process import mut_process_router
from modules.api.routes.mutations import mutations_router
from modules.api.routes.events import events_router
from modules.api.routes.stims import stims_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Запускаем фоновую задачу
    service_manager = ServiceManager()
    task = asyncio.create_task(service_manager.run())
    yield
    # Останавливаем при завершении
    await service_manager.stop()
    try:
        await task
    except asyncio.CancelledError:
        print("Фоновая задача остановлена")


app = FastAPI(title="FinFanResearchCener",
              lifespan=lifespan,
              debug=True)

app.include_router(utils_router)
app.include_router(subject_router)
app.include_router(bio_router)
app.include_router(task_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(assignment_router)
app.include_router(mut_process_router)
app.include_router(mutations_router)
app.include_router(events_router)
app.include_router(stims_router)

app.middleware("http")(exception_catcher)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Разрешает все домены (можно указать конкретные, например ["https://example.com"])
    allow_credentials=True,
    allow_methods=["*"
                   ],  # Разрешает все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешает все заголовки
)