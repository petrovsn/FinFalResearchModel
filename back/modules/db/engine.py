from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from modules.db.models import Base
from modules.utils.config_loader import ConfigLoader
import os
import shutil

class BackupDB:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(BackupDB, cls).__new__(cls)
            cls._instance.last_idxs = {}
        return cls._instance 
    
    def get_next_index(self, category):
        if category in self.last_idxs:
            return self.last_idxs[category]
        db_backup_folder = ConfigLoader().get_db_backup_file()+f"/{category}/"
        files = os.listdir(db_backup_folder)
        index = len(files)
        self.last_idxs[category] = index
        return index
    
    def execute(self, category):
        db_backup_folder = ConfigLoader().get_db_backup_file()+f"/{category}/"
        if not os.path.exists(db_backup_folder):
            os.mkdir(db_backup_folder)
        db_file = ConfigLoader().get_db_file()

        last_index = self.get_next_index(category)
        back_nums = ConfigLoader().get_db_backup_num()
        prefix = last_index%back_nums
        file_name = db_backup_folder+f"db[{prefix}].db"
        shutil.copyfile(db_file, file_name)
        self.last_idxs[category] = (last_index+1)%100

    def execute_on_operation(self,category, prefix = None ):
        db_backup_folder = ConfigLoader().get_db_backup_file()+f"/{category}/"
        if not os.path.exists(db_backup_folder):
            os.mkdir(db_backup_folder)

        files = os.listdir(db_backup_folder)
        files = sorted(files, key=lambda x: os.path.getctime(db_backup_folder+x), reverse=True)
        back_nums = ConfigLoader().get_db_backup_num()
        if len(files)>back_nums:
            for file in files[back_nums:]:
                os.remove(db_backup_folder+file)

        db_file = ConfigLoader().get_db_file()
        file_name = db_backup_folder+f"{prefix}_db.db"
        shutil.copyfile(db_file, file_name)
        


class DbEngine:
    _instance = None  # Приватное поле для хранения единственного экземпляра

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DbEngine, cls).__new__(cls)
            cls._instance.prepare_engine(ConfigLoader().get_db_file())
        return cls._instance 
    
    def prepare_engine(self, db_file:str):
        self.engine = create_engine('sqlite:///'+db_file, echo=False)
        Base.metadata.create_all(self.engine)
        self.sessionmaker = sessionmaker(bind=self.engine)

    def get_session(self):
        return self.sessionmaker()




            
