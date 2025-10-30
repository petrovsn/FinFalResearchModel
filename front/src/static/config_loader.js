
class ConfigLoader {
    constructor() {
        
        this.config = window.appConfig;
        console.log("ConfigLoader.init", this.config)

    /*fetch('/config.json')
            .then(response => response.json())
            .then(config => {
                // Используйте конфиг
                console.log(config);
                this.config = config
            });*/
    }

    upload_config = (params) =>{
        this.config = params
    }

    get_server_url = () => {
        let currentUrl = "http:"+window.location.href.split(":")[1]+':'
        return currentUrl+this.config["backend_port"]
    }
}


export const config_loader = new ConfigLoader()