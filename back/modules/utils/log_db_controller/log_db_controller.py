from sqlalchemy import Integer, String, func, ForeignKey, Column, Enum, Boolean, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import DeclarativeBase, declared_attr
from datetime import datetime
from sqlalchemy import select, delete
from sqlalchemy import desc, asc
from datetime import timezone

from modules.db.engine import BackupDB

Base = declarative_base()
class LogRecord(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    level: Mapped[str] = mapped_column(String)
    user: Mapped[str] = mapped_column(String, nullable=True)
    url: Mapped[str] = mapped_column(String, nullable=True)
    action: Mapped[str] = mapped_column(String)
    params: Mapped[str] = mapped_column(String, nullable=True)
    result: Mapped[str] = mapped_column(String, nullable=True)
    comments: Mapped[str] = mapped_column(String, nullable=True)

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + 's'
    
class LogDbEngine:
    def __init__(self, db_file:str):
        self.engine = create_engine('sqlite:///'+db_file, echo=True)
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)


    def create_record(self,level,user, url, action,params,result,comments):
        with self.session() as session:
            record = LogRecord(level = level, user = user, url = url, action = action, params = params, result = result,comments=comments)
            session.add(record)
            session.commit()
            if level == "info":
                BackupDB().execute_on_operation("on_operation", prefix = record.id)


    def get_logs(self, not_before = None, not_after  = None, user  = None, action  = None, result  = None, offset = None, count =None, sorting_key:str|None = None, sorting_desc:bool|None = None):
        
        print(not_before,not_after )
        #if not_before:
        #    not_before = not_before.replace(tzinfo=timezone.utc)
        #if not_after:
        #    not_after = not_after.replace(tzinfo=timezone.utc)
        with self.session() as session:
            query = select(LogRecord)
            if not_before:
                query = query.where(LogRecord.created_at>=not_before)
            
            if not_after:
                query = query.where(LogRecord.created_at<=not_after)

            if user:
                query = query.where(LogRecord.user.like(f'%{user}%'))

            if action:
                query = query.where(LogRecord.action.like(f'%{action}%'))

            if result:
                query = query.where(LogRecord.result == result)

            if sorting_key == None:
                query = query.order_by(desc(LogRecord.created_at)) 
            else:
                sorting_func = desc if sorting_desc else asc
                current_attr = getattr(LogRecord, sorting_key)
                query = query.order_by(sorting_func(current_attr)) 

            if offset!=None:
                query = query.offset(offset)
                
            if count!=None:
                query = query.limit(count)

            result = session.execute(query)
            output = [a for a in result.scalars()]
            #for i, k in enumerate(output):
            #    output[i].created_at = output[i].created_at.replace(tzinfo=timezone.utc)
            return output



            
