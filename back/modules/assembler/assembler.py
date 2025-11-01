from modules.db.repos.assign_repo import AssignRepo
from modules.db.repos.events_repo import EventsRepo
from modules.db.repos.mut_process_repo import MutProcessRepo
from modules.db.repos.mutation_repo import MutationRepo
from modules.db.repos.scilog_repo import SciLogRepo
from modules.db.repos.statshistory_repo import StatsHistoryRepo
from modules.db.repos.task_repo import TaskRepo
from modules.db.repos.subject_repo import SubjectRepo
from modules.db.engine import DbEngine
from modules.db.repos.user_repo import UserRepo

class InfrastuctureAssemblyParamsContext:
    def __enter__(self):
        self.session = DbEngine().get_session()
        subject_repo = SubjectRepo(self.session)
        task_repo =TaskRepo(self.session)
        scilog_repo = SciLogRepo(self.session)
        users_repo = UserRepo(self.session)
        assign_repo = AssignRepo(self.session)
        stat_history_repo = StatsHistoryRepo(self.session)
        mutation_repo = MutationRepo(self.session)
        mutprocess_repo =MutProcessRepo(self.session)
        events_repo = EventsRepo(self.session)
        #hasher_class = MockHasherImpl
        return {"subject_repo":subject_repo, "task_repo":task_repo, "scilog_repo":scilog_repo, 
                "users_repo":users_repo, "assign_repo":assign_repo, "stat_history_repo": stat_history_repo,
                "mutation_repo":mutation_repo, "mutprocess_repo":mutprocess_repo, "events_repo":events_repo}

    def __exit__(self, exc_type, exc_value, traceback):
        self.session.close()
        if exc_type is not None:
            print(f"Произошло исключение: {exc_value}")
            return False
        # Если вернуть True, исключение будет подавлено
        return True
    

async def get_InfrastuctureAssemblyParams():
    with InfrastuctureAssemblyParamsContext() as context:
        yield context