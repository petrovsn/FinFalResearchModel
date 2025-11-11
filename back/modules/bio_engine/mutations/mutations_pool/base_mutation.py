from modules.core.entities import SubjectOut


class BaseMutation:
    def __init__(self):
        self.name = self.__class__.__name__


    def apply_effect(self, subject_obj: SubjectOut):
        pass