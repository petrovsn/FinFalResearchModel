from datetime import datetime, timezone
import random
from typing import List
from modules.bio_engine.mako_engine import MakoEngine
from modules.core.exceptions import BaseCustomException
from modules.core.scilog import SciLogRecord
from modules.core.use_cases.base_case import UseCase, logging_decorator
from modules.core.entities import MakoEnergy, Subject, MakoInjection, SubjectStatus, Task, TaskStatus
from modules.core.use_cases.mutations_case import GenerateMutation
from modules.core.use_cases.subject_case import UpdateSubjectStatsHistory
from modules.utils.config_loader import ConfigLoader


class GetTasks(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        data = self.task_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return data

class SetTaskStatus(UseCase):
    @logging_decorator
    async def execute(self, task_id: int, task_status: str):
        task_object: Task|None = self.task_repo.get_by_id(task_id)
        match task_status:
            case "cancelled":
                rel_subject:Subject = self.subject_repo.get_by_id(task_object.subject_id)
                rel_subject.status = SubjectStatus.READY
                self.subject_repo.update(rel_subject.id, rel_subject)
                task_object.status = task_status
                self.task_repo.update(task_object.id, task_object)

class ComplyTask(UseCase):
    

    @logging_decorator
    async def execute(self, subject_id: int, input_numbers: List[int]):
        task_object: Task | None = self.task_repo.get_active_for_subject(
            subject_id)
        if not task_object:
            raise BaseCustomException("no active challenge")


        task_object.set_input_numbers(input_numbers)
        self.task_repo.update(task_object.id, task_object)

        proceed_mako_injection_case: ProceedMakoInjection = ProceedMakoInjection(**self.get_infrastructure_copy())
        result = await proceed_mako_injection_case.execute(subject_id, task_object.m_injection, task_object.f1_score)
        return result

class CreateTask(UseCase):
    async def execute(self, new_task:Task):
        data: List[Task] = self.task_repo.get()
        for task in data:
            if task.subject_id == new_task.subject_id:
                if task.status == TaskStatus.ACTIVE:
                    task.status = TaskStatus.CANCELLED
                    self.task_repo.update(task.id, task)

        task_id = self.task_repo.save(new_task)
        return task_id

class GetTaskComplexity(UseCase):
    async def execute(self, offset, count):
        data = self.scilog_repo.get(offset, count)
        return data


class GetActualTask(UseCase):
    async def execute(self, subject_ud):
        data = self.task_repo.get_active_for_subject(subject_ud)
        return data
    


class ProceedMakoInjection(UseCase):
    @logging_decorator
    async def execute(self, subject_id: int,  m_injection: MakoInjection, assimilation_percentage: float):
        log_record: SciLogRecord = SciLogRecord(self.scilog_repo, self.request_data.name)
        subject: Subject = self.subject_repo.get_by_id(subject_id)
        if subject==None:
            raise Exception()
        
        old_cell_stability = subject.cell_stability
        
        log_record.save_initial_state(subject)
        log_record.save_action("mako_injection", m_injection)

        #сколько энергии будет отторгнуто и будет дестабилизировать клетки
        evo_energy: MakoEnergy = m_injection.get_evo_energy(assimilation_percentage)
        cell_unstability: int = m_injection.get_cell_unstability(assimilation_percentage)
        
        #вводим энергию
        subject.input_mako_energy(evo_energy)
        
        #накидываем штраф за отторжение
        subject.apply_cell_unstability(cell_unstability)

        new_tissues = MakoEngine.get_evolved_tissues(subject)
        subject.update_tissues(new_tissues)

        new_cell_stability = subject.cell_stability

        

        subject.status = SubjectStatus.ON_REST
        subject.status_change_timestep = datetime.now()
        self.subject_repo.update(subject_id, subject)

        #ПОМЕНЯТЬ ПОЗЖЕ
        if old_cell_stability!= new_cell_stability:
            generate_mutation = self.get_case(GenerateMutation)
            await generate_mutation.execute(subject, old_cell_stability, new_cell_stability)
        #mutations_counter = MakoEngine.get_mutations(old_cell_stability, new_cell_stability)
        #case = GenerateMutation(**self.get_infrastructure_copy())
        #await case.execute(subject_id,mutations_counter)


        
        log_record.save_final_stage(subject)
        log_record.commit()

        await UpdateSubjectStatsHistory(**self.get_infrastructure_copy()).execute(subject_id)

        result = {
            "energy_assimilated":evo_energy.get_summary_mako_level(),
            "cell_unstability":cell_unstability,
            "warning_low_cell_stability": False,
            "warning_low_mental_stability": False
        }

        if subject.cell_stability < ConfigLoader().get_cell_stability_warning_treshold():
            result["warning_low_cell_stability"] = True

        return result


