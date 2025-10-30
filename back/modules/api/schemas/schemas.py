from datetime import datetime
from fastapi import Header
from pydantic import BaseModel
from typing import Annotated, List, Dict
from enum import Enum

from modules.core.entities import EventType, MakoInjection, UserRole

class InitiateServerSchema(BaseModel):
    login: str
    password: str

class CreateUserSchema(BaseModel):
    login: str
    name: str
    password: str
    role: UserRole


class CreateSubjectSchema(BaseModel):
    name: str
    


class MakoInjectionData(BaseModel):
    subject_id: int
    mako_injection: MakoInjection

class JenovaInjectionData(BaseModel):
    subject_id: int
    jenova_cells: int

class MakoAssimilationChallengerResult(BaseModel):
    subject_id: int
    input_numbers: List[int]

class MakoTaskStatus(BaseModel):
    task_status: str

class DrugInjectionData(BaseModel):
    subject_id: int
    drug_injection: int

class UserLoginData(BaseModel):
    login: str
    password: str

class UserImportData(BaseModel):
    csv_users: str


DateTimeHeader = Annotated[datetime, Header(convert_underscores=False)]


class MutationSupressionResult(BaseModel):
    success_points: int
    confirmation_code: str


class EventCreationScheme(BaseModel):
    event_type: EventType
    multiple: bool = False
    name: str
    description: str