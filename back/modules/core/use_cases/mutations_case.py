from copy import deepcopy
from  datetime import datetime

from matplotlib.pylab import rand
from matplotlib.style import available
from modules.event_engine.event_engine import EventEngine
from modules.utils.config_loader import ConfigLoader
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

    def get_mutation_class(self, start_cell_stability, finish_cell_stability):
        mutation_tresholds = ConfigLoader().get_mutation_tresholds()
        light_points = 0
        hard_points = 0
        if start_cell_stability >= mutation_tresholds[0] > finish_cell_stability:
            light_points+=1
        if start_cell_stability >= mutation_tresholds[1] > finish_cell_stability:
            light_points+=1
        if start_cell_stability >= mutation_tresholds[2] > finish_cell_stability:
            hard_points+=1

        if hard_points == 0 and light_points == 0:
            return None

        if hard_points == 0:
            if light_points == 1:
                return MutationClass.MINOR
            
            if light_points == 2:
                return MutationClass.MAJOR
        else:
            if light_points == 0:
                return MutationClass.MAJOR
            else:
                return MutationClass.FATAL
        
        
    def get_complexity(self, mut_class: MutationClass):
        match mut_class:
            case MutationClass.MINOR: return 1
            case MutationClass.MAJOR: return 3
            case MutationClass.FATAL: return 5
        return -1
    
    def select_mutation(self, subject_obj: Subject, available_mutations):
        for mutation in available_mutations:
            max_rate = mutation[1]
            filtered_muts = [a[0] for a in available_mutations if a[1]==max_rate and a[0] not in subject_obj.mutations]
            if filtered_muts != []:
                selected_mut = random.choice(filtered_muts)
                return selected_mut
        return "ALARM!!"

        
    def generate_confirmation_code(self, complexity):
        code = ""
        for i in range(complexity):
            code = get_random_string(4)+","
        return code[:-1]


    @logging_decorator
    async def execute(self, subject_obj: Subject, start_cell_stability, finish_cell_stability):
        

        mutation_class = self.get_mutation_class(start_cell_stability, finish_cell_stability)
        if mutation_class == None:
            return
        complexity = self.get_complexity(mutation_class)


        available_mutations = await self.get_case(GetAvailableMutationsForSubject).execute(subject_obj.id, mutation_class)

        selected_mutation = self.select_mutation(subject_obj,available_mutations)

    
        mutation_obj = MutationProcess(
            subject_id=subject_obj.id,
            subject_name=subject_obj.name,
            start_cell_stability = start_cell_stability,
            finish_cell_stability = finish_cell_stability,
            mutation_class=mutation_class,
            complexity=complexity,
            name = selected_mutation,
            confirmation_code=self.generate_confirmation_code(complexity)
        )

        self.mutprocess_repo.save(mutation_obj)
        update_status_case = self.get_case(SetSubjectStatusCase)
        await update_status_case.execute(subject_obj.id, SubjectStatus.MUTATION)

class GetAvailableMutationsForSubject(UseCase):
    async def execute(self, subject_id, mutation_class: MutationClass|None = None):
        subject:Subject = self.subject_repo.get_by_id(subject_id)
        if not subject: return None
        
        filters = {}
        if mutation_class!=None:
            filters={"mutation_class":mutation_class}

        mutation_list: List[Mutation] = self.mutation_repo.get(filters=filters)
        result = []
        for mutation in mutation_list:
            mut_rate = EventEngine().get_rate(subject.name, mutation.conditions)
            if mut_rate>0:
                result.append((mutation.name, mut_rate))
        
        return sorted(result, key=lambda x: x[1], reverse=True)


class SetMutationResult2Process(UseCase):
    @logging_decorator
    async def execute(self, mut_process_id: int, mutation_name: str):
        mutation_process: MutationProcess = self.mutprocess_repo.get_by_id(mut_process_id)
        mutation_process.name = mutation_name
        self.mutprocess_repo.update(mutation_process.id, mutation_process)

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

class GetPotentialMutations(UseCase):
    async def execute(self, subject_name):
        mutations:List[Mutation] = self.mutation_repo.get()
        result = {}
        for mutation in mutations:
            mutation_rate = EventEngine().get_rate(subject_name, mutation.conditions)
            if mutation_rate!=0:
                result[mutation.name] = (mutation_rate, len(mutation.conditions))
        return result
    
class CompleteMutProcess(UseCase):
    @logging_decorator
    async def execute(self, mutation_id):
        mutation:MutationProcess = self.mutprocess_repo.get_by_id(mutation_id)
        mutation.status = MutProcessStatus.COMPLETED
        self.mutprocess_repo.update(mutation_id,mutation)
        subject_id = mutation.subject_id
        subject_obj: Subject = self.subject_repo.get_by_id(subject_id)
        subject_obj.add_mutation(mutation.name)
        self.subject_repo.update(subject_id, subject_obj)
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
                mutation_class = data.mutation_class,
                description = data.description, 
                conditions = data.conditions
        )
        self.mutation_repo.save(mutation_obj)

class DeleteMutation(UseCase):
    @logging_decorator
    async def execute(self,  mut_id):
        self.mutation_repo.delete(mut_id)

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
                mutation_class = row_splitted[1]
                description = row_splitted[2]
                conditions = row_splitted[3:]
                parsed_data.append(MutationCreationScheme(
                    name = name,
                    mutation_class=mutation_class,
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