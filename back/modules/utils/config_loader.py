import configparser
from datetime import timedelta
import psutil
import getpass
import os
import argparse
import json

def print_config(config_read):
    for section in config_read.sections():
        print(f"[{section}]")
        for key, value in config_read[section].items():
            print(f"{key} = {value}")
        print()

class ConfigLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConfigLoader, cls).__new__(cls)
            cls._instance.config = configparser.ConfigParser()
            parser = argparse.ArgumentParser(description='Add user')
            parser.add_argument('-c',
                                '--config',
                                type=str,
                                help='path to config file')
            args = parser.parse_args()
            print("ConfigLoader.args:", args)
            cls._instance.filename = args.config if args.config else "configs/config.ini"
            print("ConfigLoader.filename:", cls._instance.filename)
            if not os.path.exists(cls._instance.filename):
             raise Exception("no config file")
            cls._instance.config.read(cls._instance.filename)
            print("ConfigLoader.config:")
            print_config(cls._instance.config)
        return cls._instance

    def init(self):
        pass

    def get_app_version(self):
        VERSION = "2.0"
        return VERSION

    def update(self, config_dict):
        for key in config_dict:
            self.config[key] = config_dict[key]

        with open(self.filename, 'w', encoding='utf-8') as configfile:
            self.config.write(configfile)

    def get_app_port(self):
        return int(self.config["app"]["port"])

    def get_db_file(self):
        return self.config["db"]["file"]
    
    def get_db_backup_file(self):
        return "db/backup/"
    
    def get_db_backup_num(self):
        return int(self.config["db"]["backup_num"])

    def get_num_mako_cost(self):
        return int(self.config["engine"]["num_mako_cost"])
    
    def mako_leaking_per_phase(self):
        return int(self.config["engine"]["mako_leaking_per_phase"])
    

    def get_cell_stability_warning_treshold(self):
        return int(self.config["warnings"]["cell_stability_warning_treshold"])
    
    def get_mental_stability_warning_treshold(self):
        return int(self.config["warnings"]["mental_stability_warning_treshold"])
    
    def get_on_rest_stage_duration(self):
        duration = int(self.config["engine"]["on_rest_stage_duration"])
        return timedelta(seconds=duration)
        
    def get_services(self):
        return self.config["services"]
    
    def get_mutation_tresholds(self):
        muts =  self.config["engine"]["mutation_tresholds"]
        return [int(a) for a in muts.strip().split()]
    
    def get_mutation_supressing_time(self):
        muts_time =  int(self.config["engine"]["mutation_supressing_time"])
        return timedelta(seconds=muts_time)
    
    def get_default_mutation_weight(self):
        data =  float(self.config["engine"]["default_mutation_weight"])
        return data