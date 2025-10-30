
from modules.assembler.assembler import InfrastuctureAssemblyParamsContext, get_InfrastuctureAssemblyParams
from modules.background.services.base_service import BackgroundServiceBase
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.bio_case import ProceedNextTimePhase
from modules.core.use_cases.subject_case import UpdateSubjectOnRestStatus

class SubjectOnRestStatusUpdater(BackgroundServiceBase):
    async def execute(self):
        
        with InfrastuctureAssemblyParamsContext() as context:
            case: UpdateSubjectOnRestStatus = UseCaseFactory.get(UpdateSubjectOnRestStatus, context)
            await case.execute()
            #print("SubjectOnRestStatusUpdater")
        #ProceedNextTimePhase()