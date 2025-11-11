from sqlalchemy import Integer, String, Float, func, ForeignKey, Column, Enum, Boolean, create_engine, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import inspect
from datetime import datetime
from sqlalchemy import select, delete
from sqlalchemy import desc
from traitlets import Bool

# Базовый класс для всех моделей
class Base(DeclarativeBase):
    __abstract__ = True  # Класс абстрактный, чтобы не создавать отдельную таблицу для него
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now)

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + 's'
    
    def to_dict(self):
        return {column.key: getattr(self, column.key) for column in inspect(self).mapper.columns}
    
class Subject(Base):
    name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    data: Mapped[str] = mapped_column(String)

class Task(Base):
    created_at: Mapped[DateTime] = mapped_column(DateTime)
    subject_id: Mapped[int] = mapped_column(Integer)
    subject_name : Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    m_injection: Mapped[str] = mapped_column(String)
    task_numbers: Mapped[str] = mapped_column(String)
    input_numbers : Mapped[str] = mapped_column(String)
    complexity: Mapped[int] = mapped_column(Integer)
    f1_score: Mapped[float] = mapped_column(Float, nullable=True)

class SciLogRecord(Base):
    created_at: Mapped[DateTime] = mapped_column(DateTime)
    created_by: Mapped[str] = mapped_column(String)
    subject_name: Mapped[str] = mapped_column(String)
    action_type: Mapped[str] = mapped_column(String)
    action_params: Mapped[str] = mapped_column(String)
    initial_state: Mapped[str] = mapped_column(String)
    final_state: Mapped[str] = mapped_column(String)

class User(Base): 
    login: Mapped[str] = mapped_column(String)
    password: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    subject_id: Mapped[int] = mapped_column(Integer, nullable=True)


class SubjectAssignment(Base):
    subject_id: Mapped[int] = mapped_column(Integer)
    subject_name: Mapped[str] = mapped_column(String)
    doctor_id: Mapped[int] = mapped_column(Integer, nullable=True)
    doctor_name: Mapped[str] = mapped_column(String, nullable=True)


class StatsHistory(Base):
    created_at: Mapped[DateTime] = mapped_column(DateTime)
    subject_id: Mapped[int] = mapped_column(Integer)
    subject_name: Mapped[str] = mapped_column(String)
    cell_stability: Mapped[int] = mapped_column(Integer)
    mental_stability: Mapped[int] = mapped_column(Integer)
    stats_health: Mapped[int] = mapped_column(Integer)
    stats_strength : Mapped[int] = mapped_column(Integer)
    stats_reaction : Mapped[int] = mapped_column(Integer)
    jenova_cells: Mapped[int] = mapped_column(Integer)



class MutationProcess(Base):
    created_at: Mapped[DateTime] = mapped_column(DateTime)
    subject_id: Mapped[int] = mapped_column(Integer)
    subject_name: Mapped[str] = mapped_column(String)
    start_cell_stability: Mapped[int] = mapped_column(Integer)
    finish_cell_stability: Mapped[int] = mapped_column(Integer)
    mutation_class: Mapped[str] = mapped_column(String)
    complexity: Mapped[int] = mapped_column(Integer)
    result: Mapped[int] = mapped_column(Integer, nullable=True)
    supression_start: Mapped[DateTime] = mapped_column(DateTime, nullable=True, default = None)
    confirmation_code: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)


class Mutation(Base):
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    conditions: Mapped[str] = mapped_column(String)

class Event(Base):
    code: Mapped[str] = mapped_column(String, unique=True)
    event_type: Mapped[str] = mapped_column(String)
    multiple: Mapped[bool] = mapped_column(Boolean)
    used: Mapped[bool] = mapped_column(Boolean)
    name: Mapped[str] = mapped_column(String, unique=True)
    description: Mapped[str] = mapped_column(String)
    subjects: Mapped[str] = mapped_column(String)