from loguru import logger
from modules.utils.config_loader import ConfigLoader
from modules.utils.log_db_controller.log_db_controller import LogDbEngine

class Logger:
    _instance = None  # Приватное поле для хранения единственного экземпляра

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Logger, cls).__new__(cls)
            log_db_file = ConfigLoader().get_db_file()
            cls._instance.db_engine = LogDbEngine(log_db_file)
            print(cls._instance.db_engine)
        return cls._instance

    def info(self, user, url, action, params, result = "success", comments = ""):
        self.db_engine.create_record("info", user, url, action, params, result, comments)
        message = f"{user} {action} {params} {result} {comments}"
        logger.info(message)

    def warning(self, user, url, action, params, result = "success", comments = ""):
        self.db_engine.create_record("warning", user, url, action, params, result, comments)
        message = f"{user} {action} {params} {result} {comments}"
        logger.warning(message)

    def critical(self, user, url, action, params, result = "success", comments = ""):
        self.db_engine.create_record("critical", user, url, action, params, result, comments)
        message = f"{user} {action} {params} {result} {comments}"
        logger.critical(message)

    def get_logs(self, not_before, not_after, user, action, result, offset, count, sorting_key, sorting_desc ):
        result = self.db_engine.get_logs(not_before, not_after, user, action, result, offset, count, sorting_key, sorting_desc )
        return result

    def clear(self):
        pass
