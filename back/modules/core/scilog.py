

from encodings import raw_unicode_escape
from re import sub
from typing import Any
from pydantic import BaseModel
from modules.bio_engine.mako_engine import MakoEngine
from modules.core.entities import Stats, Subject
from modules.db.repos.scilog_repo import SciLogRepo


class SavedState(BaseModel):
    mental_stability: int
    cell_stability: int
    stats: Stats
    mutations: Any

class SciLogRecord:
    def __init__(self, log_repo:SciLogRepo, doctors_name:str):
        self.created_by = doctors_name
        self.log_repo:SciLogRepo = log_repo
        self.subject_name = None
        self.action = None
        self.action_params = None

    def save_initial_state(self, subject: Subject):
        self.subject_name = subject.name
        stats = MakoEngine.get_new_stats(subject)
        self.initial_state = SavedState(
            mental_stability=subject.mental_stability,
            cell_stability = subject.cell_stability,
            stats = stats,
            mutations = subject.mutations
        ).model_dump_json()

    def save_action(self, action, action_params):
        self.action = action
        if hasattr(action_params, "model_dump_json"):
            self.action_params = action_params.model_dump_json()
        else:
            self.action_params = str(action_params)

    def save_final_stage(self, subject:Subject):
        if self.subject_name != subject.name:
            raise Exception("WRONG RECORD")
        stats = MakoEngine.get_new_stats(subject)
        self.final_state = SavedState(
            mental_stability=subject.mental_stability,
            cell_stability = subject.cell_stability,
            stats = stats,
            mutations = subject.mutations
        ).model_dump_json()


    def commit(self):
        self.log_repo.create(
            self.created_by,
            self.subject_name,
            self.action, 
            self.action_params,
            self.initial_state, 
            self.final_state
        )