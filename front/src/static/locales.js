
class LocalesController{
    constructor() {
        this.language = "russian"
        console.log("LocalesController.init")
        this.locales = {}
        this.load_locale_file(this.language)        
    }

    load_locale_file = (language) => {
        fetch('/languages/'+language+'.json')
        .then(response => response.json())
        .then(locales => {
            // Используйте конфиг
            console.log(locales);
            this.locales = locales
        });
    }

    get = (key) => {
        if (key in this.locales){
            return this.locales[key]
        }
        return key
    }
}

export const locales = new LocalesController()