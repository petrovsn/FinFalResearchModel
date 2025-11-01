
from modules.assembler.assembler import InfrastuctureAssemblyParamsContext, get_InfrastuctureAssemblyParams
from modules.background.services.base_service import BackgroundServiceBase
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.bio_case import ProceedNextTimePhase
from modules.core.use_cases.mutations_case import CheckTimeoutedMutProcesses

class MutationChecker(BackgroundServiceBase):
    async def execute(self):
        
        with InfrastuctureAssemblyParamsContext() as context:
            case: CheckTimeoutedMutProcesses = UseCaseFactory.get(CheckTimeoutedMutProcesses, context)
            await case.execute()
        #ProceedNextTimePhase()