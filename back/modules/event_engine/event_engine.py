import os
import pandas as pd
from modules.utils.singleton_meta import SingletonMeta


class EventEngine(metaclass=SingletonMeta):
    def __init__(self):
        self._data_file = 'db/event_data.csv'
        self.df = self._load_data()

    def _load_data(self):
        """Загружает данные из файла или создает пустой DataFrame"""
        if os.path.exists(self._data_file):
            df = pd.read_csv(self._data_file, index_col=0)
            #df = df.fillna(0).astype(int)
            return df
        df = pd.DataFrame()
        df["events"] = []
        return df

    def _save_data(self):
        """Сохраняет DataFrame в файл"""
        self.df.to_csv(self._data_file)

    def add_user(self, user_name):
        """Добавляет нового пользователя как столбец с нулевыми значениями"""
        if user_name not in self.df.columns:
            # Если DataFrame пустой, нужно инициализировать его с правильной структурой
            self.df[user_name] = [0]*len(self.df)
        self._save_data()

    def add_event(self, event_name):
        """Добавляет новое событие как строку с нулевыми значениями"""
        new_idx = len(self.df)
        new_row = [event_name]+ [0]*(len(self.df.columns)-1)
        print(f"new_idx:{new_idx}, new_row:{new_row}")
        self.df.loc[event_name] = new_row
        self._save_data()

    def get_event_count(self, user_name, event_name):
        return int(self.df.loc[event_name][user_name])

    def mark_event(self, user_name, event_name, value = None):
        if not value:
            value = self.df.loc[event_name, user_name]+1
        self.df.loc[event_name, user_name] = value
        self._save_data()
        return self.df.loc[event_name, user_name]
    
    def export(self):
        # Сбрасываем индекс, чтобы имя события стало колонкой
        df_reset = self.df.reset_index()
        df_reset = df_reset.rename(columns={'index': 'event'})
        
        # Преобразуем в список словарей
        return df_reset.to_dict('records')
    
    #нужно для оценки готовности мутаций
    def get_rate(self, user_name, events_list):
        count = 0
        if len(events_list)==0: return 1
        for event_name in events_list:
            if event_name in self.df.index:
                count+=self.get_event_count(user_name,event_name)
        return count*1.0/len(events_list)