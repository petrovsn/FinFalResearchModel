
from typing import Dict
from datetime import datetime, timedelta, timezone
from re import I
from tkinter import DISABLED
from typing import List
from pydantic import BaseModel
from enum import Enum

from modules.utils.config_loader import ConfigLoader



    

#============================BIO ENGINE=================================
class MakoEnergy(BaseModel):
    nerves: int = 2
    muscules: int = 2
    blood: int = 2
    def get_summary_mako_level(self):
        return self.nerves+self.muscules+self.blood

class MakoInjection(MakoEnergy):
    def get_evo_energy(self, percentage_success):
        return MakoEnergy(
            nerves=int(self.nerves*percentage_success),
            muscules=int(self.muscules*percentage_success),
            blood=int(self.blood*percentage_success),
        )
    
    def get_cell_unstability(self, percentage_success):
        total_energy_level = self.get_summary_mako_level()
        return int(total_energy_level*(1-percentage_success))


class SubjectStatus(str, Enum):
    READY = "ready"
    INJECTED = "injected"
    ON_REST = "on_rest"
    MUTATION = "mutation"
    DISABLED = "disabled"

class TissueType(str, Enum):
    NERVES = "nerves"
    MUSCULES = "muscules"
    BLOOC = "blood"


class Tissue(BaseModel):
    tissue_type: TissueType
    current_evo_stage: int = 0
    current_mako_level: int = 0
    
    def decrease_mako(self,energy_leaking ):
        self.current_mako_level = max(0, self.current_mako_level-energy_leaking)

class Tissues(BaseModel):
    nerves: Tissue = Tissue(tissue_type="nerves")
    muscules: Tissue = Tissue(tissue_type="muscules")
    blood: Tissue = Tissue(tissue_type="blood")
    def input_mako_energy(self, m_energy:MakoEnergy):
        self.nerves.current_mako_level+=m_energy.nerves
        self.muscules.current_mako_level+=m_energy.muscules
        self.blood.current_mako_level+=m_energy.blood

    def decrease_mako(self, energy_leaking: int):
        self.nerves.decrease_mako(energy_leaking)
        self.muscules.decrease_mako(energy_leaking)
        self.blood.decrease_mako(energy_leaking)

    def get_current_stored_mako(self):
        return self.nerves.current_mako_level+self.muscules.current_mako_level+self.blood.current_mako_level


class Stats(BaseModel):
    stats_health: int = 1
    stats_reaction: int = 1
    stats_strength: int = 1

class SubjectOut(BaseModel):
    id: int
    name: str
    doctor_name: str = ""
    status: str
    mental_stability: int = 100
    cell_stability: int = 100
    jenova_cells: int = 0
    
    stats_health: int = 0
    stats_reaction: int = 0
    stats_strength: int = 0

    mutations: List[str] = []

class Subject(BaseModel):
    id: int|None = None
    name: str
    status: SubjectStatus = SubjectStatus.READY
    status_change_timestep: datetime|None = None
    mental_stability: int = 100
    cell_stability: int = 100
    jenova_cells: int = 0
    
    tissues: Tissues = Tissues()
    mutations: List[str] = []

    def apply_cell_unstability(self, unstability):
        delta = int((100-self.jenova_cells)/100)
        unstability = unstability*delta
        self.cell_stability = max(0, int(self.cell_stability-unstability))

    def apply_drug_injection(self,d_injection):
        self.mental_stability = max(0, self.mental_stability-d_injection)

    def input_mako_energy(self, m_energy:MakoEnergy):
        self.tissues.input_mako_energy(m_energy)

    def decrease_mako(self, energy_leaking:int):
        self.tissues.decrease_mako(energy_leaking)

    def update_tissues(self, tissues: Tissues):
        self.tissues = tissues

    def add_jenova(self, jenova_cells):
        self.jenova_cells = min(100, self.jenova_cells+jenova_cells)

    def get_mutations(self):
        return self.mutations
    
    def add_mutation(self, new_mutation):
        self.mutations.append(new_mutation)


class MutProcessStatus(str, Enum):
    CREATED = "created"
    IN_SUPRESSIOM = "in_supression"
    SUPRESSED = "supressed"
    COMPLETED = "completed"

class MutationClass(str, Enum):
    MINOR = "minor"
    MAJOR = "major"
    FATAL = "fatal"

class MutationProcess(BaseModel):
    id: int|None = None
    created_at: datetime|None = None
    subject_id: int
    subject_name: str
    start_cell_stability: int
    finish_cell_stability: int
    mutation_class: MutationClass
    complexity: int
    result: int|None = None
    supression_start: datetime|None = None
    confirmation_code: str|None = None
    name: str = ""
    status: MutProcessStatus = MutProcessStatus.CREATED

    def get_seconds_remain(self):
        if not self.supression_start: return None
        supressing_time: timedelta = ConfigLoader().get_mutation_supressing_time()
        current_dt = datetime.now() - self.supression_start
        seconds_left = supressing_time.seconds - current_dt.seconds
        return max(seconds_left,0)

class Mutation(BaseModel):
    id: int|None = None
    name: str
    description: str
    mutation_class: MutationClass
    conditions: List[str]

class TaskStatus(str, Enum):
    ACTIVE = "active"
    COMPLETE = "complete"
    CANCELLED = "cancelled"

class Task(BaseModel):
    id: int|None = None
    created_at:datetime
    subject_id: int 
    subject_name: str
    status: TaskStatus = TaskStatus.ACTIVE
    m_injection: MakoInjection

    task_numbers: List[int] = []
    input_numbers: List[int] = []

    complexity: int|None = None
    f1_score: float|None = None

    def get_f1_score(self):
        if len(self.input_numbers)==0: return 0
        task_numbers_set = set(self.task_numbers)
        input_numbers_set = set(self.input_numbers)
        detected_set = task_numbers_set & input_numbers_set
        precision = len(detected_set) / len(input_numbers_set)
        recall = len(detected_set) / len(task_numbers_set)
        if recall + precision == 0:
            return 0
        f1_score = (2 * precision * recall) / (recall + precision)
        return f1_score

    def set_task_numbers(self, task_numbers: List[int]):
        self.task_numbers = task_numbers
        self.complexity = len(task_numbers)

    def set_input_numbers(self, input_numbers: List[int]):
        self.input_numbers= input_numbers
        self.f1_score = self.get_f1_score()
        self.status = TaskStatus.COMPLETE

class SciLogRecord(BaseModel):
    id: int
    created_at: datetime
    created_by: str
    subject_name: str
    action_type: str
    action_params: str
    initial_state: str
    final_state: str


class StatsHistory(BaseModel):
    id: int|None= None
    created_at: datetime
    subject_id: int
    subject_name:str
    stats_health: int
    stats_reaction : int
    stats_strength : int
    cell_stability: int
    mental_stability: int
    jenova_cells: int

    def is_equal(self, other):
        if self.stats_health != other.stats_health:
            return False
        if self.stats_reaction != other.stats_reaction:
            return False
        if self.stats_strength != other.stats_strength:
            return False
        if self.cell_stability != other.cell_stability:
            return False
        if self.mental_stability != other.mental_stability:
            return False
        if self.jenova_cells != other.jenova_cells:
            return False
        return True

#============================USER BLOCK=================================
#юзер == игрок
class UserRole(str, Enum):
    MASTER = "master"
    SENIOR = "senior"
    DOCTOR = "doctor"
    SUBJECT = "subject"

class UserStatus(str, Enum):
    ACTIVE = "active"
    BANNED = "banned"


class User(BaseModel):
    id: int|None = None
    login: str
    name: str
    password: str
    role: UserRole
    status: UserStatus = UserStatus.ACTIVE
    subject_id: int|None = None

class SubjectAssignment(BaseModel):
    id: int|None = None
    subject_id: int
    subject_name: str
    doctor_id: int|None = None
    doctor_name: str|None = None

#============================UTILITY===================================
class UserRequestInfo(BaseModel):
    login: str
    name: str
    url: str
    role: UserRole


class SubjectShortData(BaseModel):
    id: int|None = None
    name: str|None = None
    status: SubjectStatus = SubjectStatus.READY
    mental_stability: int = 100
    cell_stability: int = 100
    jenova_cells: int = 0

class MemoriesData(BaseModel):
    mako_energy: int = 0
    false_percentage: int = 0


#==================EVENTS=======================================
class EventType(str, Enum):
    STORY = "story"
    STIM = "stim"
    
class Event(BaseModel):
    id: int|None = None
    code: str
    event_type: EventType
    multiple: bool = False
    used: bool = False
    name: str
    description: str
    subjects: Dict[str, List[datetime]] = {}

    def set_used(self):
        if self.multiple == False:
            self.used = True

    def is_used(self):
        return self.used
    
    def append_user(self, subject_name):
        if self.is_used():
            if not self.multiple:
                return
            
        if subject_name not in self.subjects:
            self.subjects[subject_name] = []
        self.subjects[subject_name].append(datetime.now(timezone.utc))
        self.set_used()
        
        
    
#======================STIMS===================================
class Stim(BaseModel):
    id: int|None = None
    code: str
    tissue_type: TissueType
    mako_volume: int
    used: bool = False
    used_by: str|None = None
    tissue_save: Tissue|None = None
    injected_at: datetime|None = None

