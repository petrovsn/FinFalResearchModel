

from modules.bio_engine.mutations.mutations_pool.base_mutation import BaseMutation
from modules.core.entities import SubjectOut


class ChangeStrength(BaseMutation):
    def __init__(self, value):
        super().__init__()
        self.value = value

    def apply_effect(self, subject_obj: SubjectOut):
        subject_obj.stats_strength = max(1, subject_obj.stats_strength+self.value)
        return subject_obj
    

class ChangeHealth(BaseMutation):
    def __init__(self, value):
        super().__init__()
        self.value = value

    def apply_effect(self, subject_obj: SubjectOut):
        subject_obj.stats_health = max(1, subject_obj.stats_health+self.value)
        return subject_obj
    
class ChangeReaction(BaseMutation):
    def __init__(self, value):
        super().__init__()
        self.value = value

    def apply_effect(self, subject_obj: SubjectOut):
        subject_obj.stats_reaction = max(1, subject_obj.stats_reaction+self.value)
        return subject_obj