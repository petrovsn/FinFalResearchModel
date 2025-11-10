from collections import Counter
from modules.utils.config_loader import ConfigLoader


class MutationsEngine:
    _instance = None  # Приватное поле для хранения единственного экземпляра

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MutationsEngine, cls).__new__(cls)
        return cls._instance
    

