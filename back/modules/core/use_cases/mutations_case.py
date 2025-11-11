from copy import deepcopy
from  datetime import datetime
from modules.utils.logger import Logger
import random
import base64
from modules.api.schemas.schemas import MutationCreationScheme
from modules.core.entities import  MutProcessStatus, Mutation, MutationClass, MutationProcess, Subject, SubjectStatus, Task, UserRole
from modules.core.exceptions import BaseCustomException

from modules.core.use_cases.base_case import UseCase, logging_decorator
from typing import List
from modules.core.use_cases.subject_case import SetSubjectStatusCase
from modules.utils.random_generator import get_random_string


class GetAllMutProcess(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.mutprocess_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result

class GetCurrentMutProcess(UseCase):
    async def execute(self, subject_id):
        result = self.mutprocess_repo.get_mutation_of_subject(subject_id)
        return result

class GenerateMutProcess(UseCase):
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

        self.mutprocess_repo.save(mutation_obj)
        update_status_case = self.get_case(SetSubjectStatusCase)
        await update_status_case.execute(subject_obj.id, SubjectStatus.MUTATION)

class RunMutProcessSupressing(UseCase):
    @logging_decorator
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        if mutation.status != MutProcessStatus.CREATED: return 
        mutation.supression_start = datetime.now()
        mutation.status = MutProcessStatus.IN_SUPRESSIOM
        self.mutprocess_repo.update(mutation_id, mutation)
        #mutation.status = MutProcessStatus.

class GetRemainigMutProcessSeconds(UseCase):
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        if not mutation: return None
        return mutation.get_seconds_remain()

class SetMutProcessResult(UseCase):
    @logging_decorator
    async def execute(self, mutation_id, success_points,confirmation_code):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        if not mutation: return None
        if mutation.confirmation_code != confirmation_code:
            raise BaseCustomException("wrong confirmation code")
        case = self.get_case(SupressMutProcess)
        await case.execute(mutation.id, success_points)


class CheckTimeoutedMutProcesses(UseCase):
    async def execute(self):
        mutations: List[MutationProcess] = self.mutprocess_repo.get(filters = {"status":"in_supression"})
        for mutation in mutations:
            if mutation.get_seconds_remain() == 0:
                case = self.get_case(CompleteMutProcess)
                await case.execute(mutation.id)


class SupressMutProcess(UseCase):
    @logging_decorator
    async def execute(self, mutation_id, result):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        mutation.status = MutProcessStatus.SUPRESSED
        mutation.result = result
        self.mutprocess_repo.update(mutation_id,mutation)
        case = self.get_case(SetSubjectStatusCase)
        await case.execute(mutation.subject_id, SubjectStatus.ON_REST)

    
class CompleteMutProcess(UseCase):
    @logging_decorator
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        mutation.status = MutProcessStatus.COMPLETED
        self.mutprocess_repo.update(mutation_id,mutation)
        case = self.get_case(SetSubjectStatusCase)
        await case.execute(mutation.subject_id, SubjectStatus.ON_REST)


class GetAllMutations(UseCase):
    async def execute(self, filters, offset, count, sorting_key, sorting_desc):
        result = self.mutation_repo.get(filters, offset, count, sorting_key, sorting_desc)
        return result

class CreateMutation(UseCase):
    @logging_decorator
    async def execute(self, data:MutationCreationScheme):
        mutation_obj = Mutation(
                name = data.name,
                description = data.description, 
                conditions = data.conditions
        )
        self.mutation_repo.save(mutation_obj)

class ImportMutations(UseCase):
    @logging_decorator
    async def execute(self, csv_data_b64: str):
        parsed_data  = [] 
        
        try:
            print(csv_data_b64)
            csv_data_bytes = base64.b64decode(csv_data_b64).decode(encoding='utf-8')
            rows = csv_data_bytes.split('\n')
            #формат данных - name, description, effect, condition1, condition2...
            
            for row in rows[1:]:
                if row == "": continue
                row_splitted = row.strip().split(';')
                name = row_splitted[0]
                description = row_splitted[1]
                conditions = row_splitted[2:]
                parsed_data.append(MutationCreationScheme(
                    name = name,
                    description = description,
                    conditions = conditions,
                ))
                
        except Exception as e:
            raise BaseCustomException("wrong table format")

        for event_data in parsed_data:
            case: CreateMutation = self.get_case(CreateMutation)
            try:
                await case.execute(event_data)
            except Exception as e:
                Logger().warning(self.request_data.login,
                                 self.request_data.url,
                                 "import mutations",
                                 csv_data_b64,
                                 "error", str(e))