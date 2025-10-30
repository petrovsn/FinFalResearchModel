from modules.utils.config_loader import ConfigLoader


class ServiceManagerController:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ServiceManagerController, cls).__new__(cls)
            cls._instance.init()
        return cls._instance
    
    def init(self):
        self.services = {}

        services = ConfigLoader().get_services()

        for service in services:
            activation_delay = int(services[service])
            self.services[service] = [activation_delay, True]


    def get_timeout(self, service_name:str):
        return self.services[service_name.lower()][0]
    
    def is_alive(self, service_name:str):
        return self.services[service_name.lower()][1]
    
    def get_services_info(self):
        return self.services
    
    def set_service_state(self, service_name:str, is_alive: bool):
        self.services[service_name.lower()][1] = is_alive

    def set_service_timeout(self, service_name:str, timeout: int):
        self.services[service_name.lower()][0] = timeout