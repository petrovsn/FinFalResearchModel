from collections import Counter
from modules.utils.config_loader import ConfigLoader


class Mutation:
    def __init__(self, name = "", description = "", tags = None, effects =None):
        self.name = name
        self.description = description
        self.tags = tags
        self.effects = effects #[]
        
    def from_json():
        pass

    
class MutationsEngine:
    def get_mutations(subject_id,old_cell_stability, new_cell_stability):
        mut_tresholds = ConfigLoader().get_mutation_tresholds()
        result = Counter()
        for treshold in mut_tresholds[:-1]:
            if old_cell_stability > treshold >= new_cell_stability:
                result["light"] = result["light"]+1

        if old_cell_stability > mut_tresholds[-1] >= new_cell_stability:
            result["hard"] = result["hard"]+1

        return result