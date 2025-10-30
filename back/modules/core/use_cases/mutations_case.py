from copy import deepcopy
from  datetime import datetime
import random

from modules.core.entities import MutationClass, MutationProcess, MutationStatus, Subject, SubjectStatus, Task, UserRole
from modules.core.exceptions import BaseCustomException

from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List, Dict
from modules.core.use_cases.subject_case import SetSubjectStatusCase, UpdateSubjectStatsHistory
from modules.utils.config_loader import ConfigLoader
from modules.utils.random_generator import get_random_string


class GetAllMutatutions(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.mutation_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result

class GetCurrentMutation(UseCase):
    async def execute(self, subject_id):
        result = self.mutation_repo.get_mutation_of_subject(subject_id)
        return result

class GenerateMutation(UseCase):
    @logging_decorator
    async def execute(self, subject_obj: Subject, start_cell_stability, finish_cell_stability):
        
        mutation_obj = MutationProcess(
            subject_id=subject_obj.id,
            subject_name=subject_obj.name,
            start_cell_stability = start_cell_stability,
            finish_cell_stability = finish_cell_stability,
            mutation_class=MutationClass.MAJOR,
            complexity=3,
            name = f"{start_cell_stability}->{finish_cell_stability}",
            confirmation_code=get_random_string(8)
        )

        self.mutation_repo.save(mutation_obj)
        update_status_case = self.get_case(SetSubjectStatusCase)
        await update_status_case.execute(subject_obj.id, SubjectStatus.MUTATION)

class RunMutationSupressing(UseCase):
    @logging_decorator
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutation_repo.get_by_id(mutation_id)
        if mutation.status != MutationStatus.CREATED: return 
        mutation.supression_start = datetime.now()
        mutation.status = MutationStatus.IN_SUPRESSIOM
        self.mutation_repo.update(mutation_id, mutation)
        #mutation.status = MutationStatus.

class GetRemainigSeconds(UseCase):
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutation_repo.get_by_id(mutation_id)
        if not mutation: return None
        return mutation.get_seconds_remain()



class SetMutatuionResult(UseCase):
    @logging_decorator
    async def execute(self, mutation_id, success_points,confirmation_code):
        mutation:MutationProcess = self.mutation_repo.get_by_id(mutation_id)
        if not mutation: return None
        if mutation.confirmation_code != confirmation_code:
            raise BaseCustomException("wrong confirmation code")
        case = self.get_case(SupressMutation)
        await case.execute(mutation.id, success_points)

        
        

class CheckTimeoutedMutations(UseCase):
    async def execute(self):
        mutations: List[MutationProcess] = self.mutation_repo.get(filters = {"status":"in_supression"})
        for mutation in mutations:
            if mutation.get_seconds_remain() == 0:
                case = self.get_case(CompleteMutation)
                await case.execute(mutation.id)



class SupressMutation(UseCase):
    @logging_decorator
    async def execute(self, mutation_id, result):
        mutation:MutationProcess = self.mutation_repo.get_by_id(mutation_id)
        mutation.status = MutationStatus.SUPRESSED
        mutation.result = result
        self.mutation_repo.update(mutation_id,mutation)
        case = self.get_case(SetSubjectStatusCase)
        await case.execute(mutation.subject_id, SubjectStatus.ON_REST)

    

class CompleteMutation(UseCase):
    @logging_decorator
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutation_repo.get_by_id(mutation_id)
        mutation.status = MutationStatus.COMPLETED
        self.mutation_repo.update(mutation_id,mutation)
        case = self.get_case(SetSubjectStatusCase)
        await case.execute(mutation.subject_id, SubjectStatus.ON_REST)
