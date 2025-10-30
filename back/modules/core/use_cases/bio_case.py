from copy import deepcopy
from  datetime import timezone, datetime
import random
from modules.bio_engine.mental_engine import MentalEngine
from modules.core.entities import MakoEnergy, MemoriesData, Subject, MakoInjection, SubjectStatus, Task, UserRole
from modules.core.exceptions import BaseCustomException, ObjectNonExists
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict
from modules.bio_engine.mako_engine import MakoEngine, TissueEvolutionData
from modules.core.use_cases.subject_case import UpdateSubjectStatsHistory
from modules.core.use_cases.task_case import CreateTask
from modules.utils.config_loader import ConfigLoader


class GetSciLog(UseCase):
    async def execute(self, offset, count):
        filters = {}
        if self.request_data.role == UserRole.DOCTOR:
            filters = {"created_by":self.request_data.name}
        data = self.scilog_repo.get(filters, offset, count)
        return data

class GetTissuesEvolutionData(UseCase):
    async def execute(self):
        return TissueEvolutionData().get_tissues_data()

class InjectNeuroDrugsToSubject(UseCase):
    @logging_decorator
    async def execute(self, subject_id: int,  drug_injection: int):

        subject: Subject = self.subject_repo.get_by_id(subject_id)
        if subject == None: raise ObjectNonExists()
        log_record: SciLogRecord = SciLogRecord(self.scilog_repo, self.request_data.name)
        
        log_record.save_initial_state(subject)
        log_record.save_action("drug_injection", drug_injection)

        subject.apply_drug_injection(drug_injection)
        self.subject_repo.update(subject_id, subject)
        log_record.save_final_stage(subject)
        log_record.commit()

        await UpdateSubjectStatsHistory(**self.get_infrastructure_copy()).execute(subject_id)
        return subject

class InjectJenovaToSubject(UseCase):
    @logging_decorator
    async def execute(self, subject_id: int,  jenova_cells: int):
        subject: Subject = self.subject_repo.get_by_id(subject_id)
        if subject==None:
            raise Exception()
        subject.add_jenova(jenova_cells)
        self.subject_repo.update(subject_id, subject)

        await UpdateSubjectStatsHistory(**self.get_infrastructure_copy()).execute(subject_id)
        subject

class InjectMakoToSubject(UseCase):
    @logging_decorator
    async def execute(self, subject_id: int,  m_injection: MakoInjection):
        subject: Subject = self.subject_repo.get_by_id(subject_id)
        if subject==None:
            raise Exception()
        

        

        if subject.status == SubjectStatus.INJECTED:
            raise BaseCustomException("cant inject mako twice")
        
        #current_active_task = self.task_repo.get_active_for_subject(subject_id)
        #if current_active_task!=None:
            
        
        task_object = Task(
            created_at=datetime.now(timezone.utc),
            subject_id=subject.id,
            subject_name = subject.name,
            m_injection=m_injection
        )

        #total_mako_energy = m_injection.get_summary_mako_level()
        #mental_stability = subject.mental_stability
        #Пока костыль для демонстрации
        #зависимость от менталки
        # task_object.task_numbers = bio_engine.generate_task(subject.mental_stability, total_mako_energy)
        total_mana_energy = m_injection.get_summary_mako_level()
        num_mako_cost = ConfigLoader().get_num_mako_cost()
        num_len = int(total_mana_energy/num_mako_cost)**2
        num_len = num_len*subject.mental_stability/100
        num_len = max(int(num_len), 3)
        task_numbers = [random.randint(1, 99) for i in range(num_len)]
        task_object.set_task_numbers(task_numbers)

        task_id = await CreateTask(**self.get_infrastructure_copy()).execute(task_object)
        subject.status = SubjectStatus.INJECTED
        self.subject_repo.update(subject_id, subject)
        return task_object
        


class GetMemoriesData(UseCase):
    async def execute(self, subject_id):
        subject: Subject = self.subject_repo.get_by_id(subject_id)
        if subject == None: raise ObjectNonExists()
        
        if subject.status in [SubjectStatus.READY, SubjectStatus.INJECTED]:
            return MemoriesData()
        
        if subject.status == SubjectStatus.ON_REST:
            current_free_mako_level = subject.tissues.get_current_stored_mako()
            false_percentage = subject.jenova_cells/(subject.jenova_cells+subject.mental_stability)
            return MemoriesData(
                mako_energy = current_free_mako_level,
                false_percentage = false_percentage
            )
        
        return MemoriesData()



class ProceedNextTimePhase(UseCase):
    async def execute(self):
        subjects: List[Subject] = self.subject_repo.get()

        for subject in subjects:
            mako_leaking_per_phase = ConfigLoader().mako_leaking_per_phase()
            subject_backup = deepcopy(subject)
            subject.decrease_mako(mako_leaking_per_phase)
            if subject_backup != subject:
                self.subject_repo.update(subject.id, subject)
                await UpdateSubjectStatsHistory(**self.get_infrastructure_copy()).execute(subject.id)





        