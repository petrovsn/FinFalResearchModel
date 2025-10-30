# класс исключений, которые определены ядром
from modules.utils.logger import Logger


def log_exception_creation(func):
    def wrapper(self, *args, **kwargs):
        original_result:BaseCustomException = func(self, *args, **kwargs)
        exception_name = self.__class__.__name__
        exception_mesage = self.message
        exception_object = self.object
        
        return original_result
    return wrapper

class BaseCustomException(Exception):
    def __init__(self, message: str, *args):
        super().__init__(*args)
        self.code = 510
        self.message = f"{message}"
        self.object = None

    def __str__(self):
        if self.object:
            return f"{self.message}: {str(self.object)}"
        return f"{self.message}"

class ObjectNonExists(BaseCustomException):
    
    def __init__(self, object = None, *args):
        super().__init__("object not exists", *args)
        self.object = object
        self.code = 404