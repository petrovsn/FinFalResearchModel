from modules.core.entities import Subject, Tissue, Stats, Tissues
import random
from pydantic import BaseModel
from collections import Counter
from modules.utils.config_loader import ConfigLoader

class StatsIntervals:
    pass

tissue_types = ["nerves", "muscules", "blood"]


class CellEvoStage(BaseModel):
    evo_stage_level: int
    max_mako_level: int
    min_stats_value: int
    max_stats_value: int

    def get_current_stat(self, current_mako):
        delta_stats = self.max_stats_value - self.min_stats_value

        result = self.min_stats_value+int(current_mako*delta_stats/self.max_mako_level)
        result = min(result, self.max_stats_value)
        return result
    
    def enough_for_evolution(self, current_mako):
        return current_mako>self.max_mako_level


class TissueEvolutionData:
    _instance = None  # Приватное поле для хранения единственного экземпляра
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TissueEvolutionData, cls).__new__(cls)
            cls._instance.init()
        return cls._instance

    def init(self):
        
        self.evo_stages_count = 3
        self.tissues = {}
        for tissue_type in tissue_types:
            self.load_tissue(tissue_type)

    def generate_stats_intervals(self):
        max_stat_value = 20
        min_stat_value = 1
        step = int((max_stat_value - min_stat_value) / self.evo_stages_count)
        step_overlap = int(0.3*step)
        intervals = []
        for i in range(self.evo_stages_count):
            interval = [i * step, (i + 1) * step, min_stat_value]

            interval[0]=interval[0]-random.randint(1, step_overlap)
            interval[1]=interval[1]+random.randint(1, step_overlap)

            interval[0] = max(interval[0], min_stat_value)
            interval[1] = min(interval[1], max_stat_value)
            intervals.append(interval)
        return intervals

    def load_tissue(self, tissue_name):
        intervals = self.generate_stats_intervals()
        self.tissues[tissue_name] = {}
        for stage_idx in range(self.evo_stages_count):
            self.tissues[tissue_name][stage_idx] = CellEvoStage(
                evo_stage_level=stage_idx,
                max_mako_level=random.randint(10, 20),
                min_stats_value=intervals[stage_idx][0],
                max_stats_value=intervals[stage_idx][1],
            )

    def get_stat(self, tissue_data: Tissue):
        evo_stage = tissue_data.current_evo_stage
        tis_type = tissue_data.tissue_type
        current_stage: CellEvoStage = self.tissues[tis_type][evo_stage]
        stat_value = current_stage.get_current_stat(tissue_data.current_mako_level)
        return stat_value
    
    def get_next_stage(self, tissue_data: Tissue):
        evo_stage = tissue_data.current_evo_stage
        tis_type = tissue_data.tissue_type
        mako_left = tissue_data.current_mako_level
        current_stage: CellEvoStage = self.tissues[tis_type][evo_stage]
        while current_stage.enough_for_evolution(mako_left):
            mako_left-=current_stage.max_mako_level

            evo_stage+=1
            evo_stage = min(evo_stage, self.evo_stages_count-1)
            current_stage: CellEvoStage = self.tissues[tis_type][evo_stage]

        result = tissue_data.model_copy()
        result.current_evo_stage = evo_stage
        result.current_mako_level = mako_left
        return result

    def get_tissues_data(self):
        return self.tissues


class MakoEngine:
    def get_current_evolution_stages(self):
        pass

    def get_current_value(self, tissue:Tissue):
        pass

    def get_evolved_tissues(subject: Subject):
        result = {}
        result = {}
        for tis_type in tissue_types:
            stage = TissueEvolutionData().get_next_stage(getattr(subject.tissues, tis_type))
            result[tis_type]= stage
        return Tissues(**result)

    def get_new_stats(subject: Subject):
        result = {}

        result["stats_health"]=  TissueEvolutionData().get_stat(subject.tissues.blood)
        result["stats_reaction"]=  TissueEvolutionData().get_stat(subject.tissues.nerves)
        result["stats_strength"]=  TissueEvolutionData().get_stat(subject.tissues.muscules)

        return Stats(**result)

    def get_mutations_old(cell_stability):
        check = random.randint(0,100)
        if check>cell_stability:
            return True
        return False



