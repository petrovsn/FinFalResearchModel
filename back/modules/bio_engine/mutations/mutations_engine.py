from collections import Counter
from typing import Dict, List
from modules.bio_engine.mutations.mutations_pool.base_mutation import BaseMutation
from modules.bio_engine.mutations.mutations_pool.change_stats_mutation import ChangeHealth, ChangeReaction, ChangeStrength
from modules.core.entities import Subject, SubjectOut
from modules.utils.config_loader import ConfigLoader


class MutationsEngine:
    _instance = None  # Приватное поле для хранения единственного экземпляра

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MutationsEngine, cls).__new__(cls)
            cls._instance.init()
        return cls._instance
    

    def init(self):
        self.get_subject_info_mutations:Dict[str, BaseMutation] = {
            "IncreaseStrength1": ChangeStrength(1),
            "IncreaseReaction1": ChangeReaction(1),
            "IncreaseHealth1": ChangeHealth(1),
            "DecreaseStrength1": ChangeStrength(-1),
            "DecreaseReaction1": ChangeReaction(-1),
            "DecreaseHealth1": ChangeHealth(-1),
        }

    def apply_mutations_at_get_subject_info(self, subject_obj: SubjectOut):
        mutations:List[str] = subject_obj.mutations
        for mutation in mutations:
            if mutation in self.get_subject_info_mutations:
                subject_obj = self.get_subject_info_mutations[mutation].apply_effect(subject_obj)
        return subject_obj


