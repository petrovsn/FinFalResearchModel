from datetime import date, datetime
import json

from pydantic import BaseModel

from modules.db.engine import BackupDB, DbEngine
from sqlalchemy import JSON, select, delete,desc, asc

def backup_decorator(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        BackupDB().execute("on_operation")
        return result
    return wrapper

class BaseRepository:
    model = None
    model_core = None

    def __init__(self, session):
        self.session = session

    def get_dto_from_model(self, model_obj):
        if model_obj == None: return None
        model_dict = model_obj.to_dict()
        return self.model_core(**model_dict)
    
    def get_model_dict_from_dto(self, model_dto:BaseModel):
        result = model_dto.model_dump()
        #result = model_dto.model_dump_json()
        #for key in ["created_at", "supression_start"]:
        #    if  key in result:
        #        result[key] = datetime.strptime(result[key])
        return result
    
    def save(self, model_dto):
        model_dict = self.get_model_dict_from_dto(model_dto)
        model_dict["created_at"] = datetime.now()
        model_obj = self.model(**model_dict)
        self.session.add(model_obj)
        self.session.commit()
        return model_obj.id
    
    def update(self, id, model_dto):
        query = select(self.model).where(self.model.id == id)
        result = self.session.execute(query)
        model_obj = result.scalar()
        model_dict = self.get_model_dict_from_dto(model_dto)
        for key in model_dict:
            if key != "id":
                setattr(model_obj,key,model_dict[key])
        self.session.commit()

    def get(self, filters:dict|None = None, offset:int|None  = None, count:int|None = None, sorting_key:str|None = None, sorting_desc:bool|None = None):
        query = select(self.model)

        if filters != None:
            for key in filters:
                if filters[key]!=None:
                    if hasattr(self.model,key):
                        current_attr = getattr(self.model, key)
                        if type(filters[key])==list:
                            query = query.where(current_attr.in_(filters[key]))
                        else:
                        
                            query = query.where(current_attr==filters[key])
    
        if sorting_key == None:
            if hasattr(self.model,"created_at"):
                query = query.order_by(desc(self.model.created_at)) 
            else:
                query = query.order_by(desc(self.model.id)) 
        else:
            if hasattr(self.model,sorting_key):
                sorting_func = desc if sorting_desc else asc
                current_attr = getattr(self.model, sorting_key)
                query = query.order_by(sorting_func(current_attr)) 

        if offset!=None:
            query = query.offset(offset)
        if count!=None:
            query = query.limit(count)


    

        result = self.session.execute(query)
        data = result.scalars().all()

        output = [self.get_dto_from_model(model_obj) for model_obj in data]
        return output



    def get_by_id(self, id):
        query = select(self.model).where(self.model.id == id)
        result = self.session.execute(query)
        model_obj = result.scalar()
        return self.get_dto_from_model(model_obj)

    def delete(self, id):
        query = delete(self.model).where(self.model.id == id)
        self.session.execute(query)
        self.session.commit()