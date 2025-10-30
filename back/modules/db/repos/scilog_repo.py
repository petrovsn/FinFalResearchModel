from datetime import datetime, timezone
from modules.db.models import SciLogRecord, Subject
from modules.db.repos.base_repo import BaseRepository, backup_decorator
from modules.core.entities import SciLogRecord as SciLogRecordCore

class SciLogRepo(BaseRepository):
    model = SciLogRecord
    model_core = SciLogRecordCore

    @backup_decorator
    def create(self, created_by: str, subject_name: str, action_type, action_params,
               initial_state, final_state):
        model_dict = {
            "created_at": datetime.now(),
            "created_by": created_by, 
            "subject_name": subject_name,
            "action_type": action_type,
            "action_params": action_params,
            "initial_state": initial_state,
            "final_state": final_state
        }
        model_obj = self.model(**model_dict)
        self.session.add(model_obj)
        self.session.commit()

        return model_obj.id
