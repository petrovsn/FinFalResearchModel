from abc import ABC, abstractmethod
from typing import Type
from modules.core.entities import UserRequestInfo, UserRole
from modules.db.repos.assign_repo import AssignRepo
from modules.db.repos.events_repo import EventsRepo
from modules.db.repos.mut_process_repo import MutProcessRepo
from modules.db.repos.mutation_repo import MutationRepo
from modules.db.repos.scilog_repo import SciLogRepo
from modules.db.repos.statshistory_repo import StatsHistoryRepo
from modules.db.repos.stim_repo import StimsRepo
from modules.db.repos.subject_repo import SubjectRepo
from modules.db.repos.task_repo import TaskRepo
from modules.db.repos.user_repo import UserRepo

from modules.utils.logger import Logger

def logging_decorator(func):
    async def wrapper(self, *args, **kwargs):
        request_data:UserRequestInfo = self.request_data
        action = func.__qualname__
        params = str(args[1:])

        arg_names = list(func.__code__.co_varnames)[:func.__code__.co_argcount]
        args_dict = {}
        

        # Обрабатываем позиционные аргументы
        for name, value in zip(arg_names[1:], args):
            args_dict[name] = value

        #args_dict.pop("self")
        args_dict = str(args_dict)
        #print(action, params)
        try:
            result = await func(self, *args, **kwargs)
            #params_str = 
            Logger().info(request_data.login, request_data.url, action, args_dict, "success", str(result))
            return result
        except Exception as e:
            print(str(e))
            Logger().warning(request_data.login, request_data.url, action, args_dict, "failed", str(e))
            raise(e)
    return wrapper


class UseCase(ABC):

    def __init__(self, subject_repo: SubjectRepo, task_repo: TaskRepo, 
                 scilog_repo: SciLogRepo, users_repo: UserRepo, assign_repo: AssignRepo,
                 stat_history_repo: StatsHistoryRepo, events_repo: EventsRepo,
                 request_data: UserRequestInfo, mutation_repo:MutationRepo, mutprocess_repo: MutProcessRepo,
                 stims_repo: StimsRepo):
        self.subject_repo: SubjectRepo = subject_repo
        self.task_repo: TaskRepo = task_repo
        self.scilog_repo: SciLogRepo = scilog_repo
        self.users_repo: UserRepo = users_repo
        self.request_data:UserRequestInfo = request_data
        self.assign_repo: AssignRepo = assign_repo
        self.stat_history_repo: StatsHistoryRepo = stat_history_repo
        self.mutprocess_repo: MutProcessRepo = mutprocess_repo
        self.mutation_repo:MutationRepo = mutation_repo
        self.events_repo: EventsRepo = events_repo
        self.stims_repo: StimsRepo = stims_repo
        
    def execute(self, *args, **kwargs):
        pass

    def get_infrastructure_copy(self):
        return {
            "subject_repo": self.subject_repo,
            "task_repo": self.task_repo,
            "scilog_repo": self.scilog_repo,
            "users_repo":self.users_repo,
            "assign_repo":self.assign_repo,
            "request_data": self.request_data,
            "stat_history_repo": self.stat_history_repo,
            "mutprocess_repo": self.mutprocess_repo,
            "mutation_repo":self.mutation_repo,
            "events_repo": self.events_repo,
            "stims_repo": self.stims_repo
        }
    
    def get_case(self, use_case_class):
        return use_case_class(**self.get_infrastructure_copy())

class UseCaseFactory:

    def get(use_case_class: Type[UseCase], params: dict, user_request_data: UserRequestInfo = UserRequestInfo(login = "system", name ="system", url = "localhost", role = UserRole.MASTER)):
        params["request_data"] = user_request_data
        return use_case_class(**params)