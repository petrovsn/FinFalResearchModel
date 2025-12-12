from datetime import datetime
from typing import List

from psutil import users
from sqlalchemy import false
from modules.bio_engine.mako_engine import MakoEngine
from modules.bio_engine.mutations.mutations_engine import MutationsEngine
from modules.core.entities import Mutation, Stats, StatsHistory, Subject, SubjectAssignment, SubjectOut, SubjectPersonalProfile, SubjectShortData, SubjectStatus, User, UserRole
from modules.core.exceptions import BaseCustomException, ObjectNonExists
from modules.core.use_cases.base_case import UseCase, logging_decorator
from modules.event_engine.event_engine import EventEngine
from modules.utils.config_loader import ConfigLoader


class GetFullSubjectInfoCase(UseCase):
    async def execute(self, subject_obj: Subject):
        stats: Stats = MakoEngine.get_new_stats(subject_obj)
        assignment: SubjectAssignment|None = self.assign_repo.get_by_id(subject_obj.id)
        data = subject_obj.model_dump()

        subject_out  = SubjectOut(**data)

        if assignment:
            subject_out.doctor_name = assignment.doctor_name

        subject_out.stats_health = stats.stats_health
        subject_out.stats_reaction = stats.stats_reaction
        subject_out.stats_strength = stats.stats_strength

        subject_out = MutationsEngine().apply_mutations_at_get_subject_info(subject_out)

        return subject_out
        
class GetSubjectPersonalProfile(UseCase):
    async def execute(self, login):
        user_obj: User = self.users_repo.get_by_login()
        subject_obj: Subject = self.subject_repo.get_by_id(user_obj.subject_id)
        mutations_list: List[Mutation] = self.mutation_repo.get()

        
        
        result:SubjectPersonalProfile  = SubjectPersonalProfile(
            name = subject_obj.name,

        )

class SetNextMutation(UseCase):
    async def execute(self, subject_id, mutation_id):
        mutation_obj:Mutation = self.mutation_repo.get_by_id(mutation_id)
        subject_obj:Subject = self.subject_repo.get_by_id(subject_id)
        subject_obj.next_mutation = mutation_obj.name
        self.subject_repo.update(subject_id, subject_obj)


class GetAllSubjectsCase(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        dto_result: List[Subject] = self.subject_repo.get(filters, offset, count, sorting_key, sorting_desc)
        result = []
        get_subj_info_case = GetFullSubjectInfoCase(**self.get_infrastructure_copy())
        for subject_obj in dto_result:
            subject_out = await get_subj_info_case.execute(subject_obj)
            result.append(subject_out)     
        return result


    
class GetSubjectInfoCase(UseCase):
    async def execute(self, subject_id):
        result = self.subject_repo.get_by_id(subject_id)
        return result

class CreateSubjectCase(UseCase):
    @logging_decorator
    async def execute(self, name):
        subject = Subject(name = name)
        result = self.subject_repo.save(subject)
        EventEngine().add_user(name)
        return result

class UpdateSubjectCase(UseCase):
    @logging_decorator
    async def execute(self, subject_id, subject_obj):
        result = self.subject_repo.update(subject_id, subject_obj)
        return result
    

class SetSubjectStatusCase(UseCase):
    @logging_decorator
    async def execute(self, subject_id, subject_status):
        subject_obj: Subject = self.subject_repo.get_by_id(subject_id)
        if not subject_obj: raise ObjectNonExists()
        subject_obj.status = subject_status
        subject_obj.status_change_timestep = datetime.now()
        result = self.subject_repo.update(subject_id, subject_obj)
        return result


class GetAssignmentsCase(UseCase):
    async def execute(self, doctor_login):
        if doctor_login!=None:
            result = self.assign_repo.get_assigned_to(doctor_login)
            return result
        
        result = self.assign_repo.get()
        return result

   

class SetAssignmetCase(UseCase):
    @logging_decorator
    async def execute(self, subject_name, doctor_name):        
        result = self.assign_repo.get(filters={"subject_name":subject_name })
        if len(result)!=1:
            raise BaseCustomException("invalid assignemt artefact")
        
        doctor_obj: User = self.users_repo.get_by_name(doctor_name)
        if not doctor_obj:
            raise BaseCustomException("no such user")

        assign_obj:SubjectAssignment = result[0]
        assign_obj.doctor_id = doctor_obj.id
        assign_obj.doctor_name = doctor_obj.name
        self.assign_repo.update(assign_obj.id, assign_obj)


class GetAvailableSubject(UseCase):
    async def execute(self, user_role, user_login, filters, offset, count, sorting_key, sorting_desc):
        result_tmp = []
        if user_role == UserRole.MASTER:
            result_tmp = self.subject_repo.get(None, offset, count, sorting_key, sorting_desc)
        
        elif user_role == UserRole.SENIOR:
            subject_names  = [u.name for u in self.users_repo.get_by_role(UserRole.SUBJECT)]
            result_tmp = self.subject_repo.get({"name":subject_names}, offset, count, sorting_key, sorting_desc)

        else:
            user_obj:User = self.users_repo.get_by_login(user_login)
            assigns:List[SubjectAssignment] = self.assign_repo.get_assigned_to(user_obj.id)
            for assignment in assigns:
                subject_obj:Subject = self.subject_repo.get_by_id(assignment.subject_id)
                result_tmp.append(subject_obj)
        
        compile_subje_info_case = GetFullSubjectInfoCase(**self.get_infrastructure_copy())
        result = []
        for subject_obj in result_tmp:
            subject_info = await compile_subje_info_case.execute(subject_obj)
            result.append(subject_info)
        return result




class UpdateSubjectStatsHistory(UseCase):
    async def execute(self, subject_id):
        subject_obj: Subject = self.subject_repo.get_by_id(subject_id)

        stats = MakoEngine.get_new_stats(subject_obj)
        if not subject_obj: raise ObjectNonExists()
        stats_history_object = StatsHistory(created_at=datetime.now(),
                                              subject_id=subject_obj.id,
                                              subject_name=subject_obj.name,
                                                stats_health = stats.stats_health,
                                                stats_strength = stats.stats_strength,
                                                stats_reaction = stats.stats_reaction,
                                                cell_stability = subject_obj.cell_stability,
                                                mental_stability = subject_obj.mental_stability,
                                                jenova_cells = subject_obj.jenova_cells)
        last_record = self.stat_history_repo.get_last_record(subject_id)
        if last_record:
            if stats_history_object.is_equal(last_record):
                return
        self.stat_history_repo.save(stats_history_object)



class GetSubjectStatsHistory(UseCase):
    async def execute(self, subject_id):
          subject_obj: Subject = self.subject_repo.get_by_id(subject_id)
          if not subject_obj: raise ObjectNonExists()
          result = self.stat_history_repo.get(filters={"subject_id":subject_obj.id}, sorting_key="created_at", sorting_desc=True)
          return result
    

class UpdateSubjectOnRestStatus(UseCase):
    async def execute(self):
        timestamp_now = datetime.now()
        on_rest_stage_duration = ConfigLoader().get_on_rest_stage_duration()
        subjects_to_check:List[Subject] = self.subject_repo.get(filters={"status":"on_rest"})
        for subject in subjects_to_check:
            if subject.status_change_timestep:
                if timestamp_now-subject.status_change_timestep>on_rest_stage_duration:
                    case: SetSubjectStatusCase = SetSubjectStatusCase(**self.get_infrastructure_copy())
                    await case.execute(subject.id, SubjectStatus.READY)
