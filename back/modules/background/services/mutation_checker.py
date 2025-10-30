
from modules.assembler.assembler import InfrastuctureAssemblyParamsContext, get_InfrastuctureAssemblyParams
from modules.background.services.base_service import BackgroundServiceBase
from modules.core.use_cases.base_case import UseCaseFactory
from modules.core.use_cases.bio_case import ProceedNextTimePhase
from modules.core.use_cases.mutations_case import CheckTimeoutedMutations

class MutationChecker(BackgroundServiceBase):
    async def execute(self):
        
        with InfrastuctureAssemblyParamsContext() as context:
            case: CheckTimeoutedMutations = UseCaseFactory.get(CheckTimeoutedMutations, context)
            await case.execute()
        #ProceedNextTimePhase()