import { store } from "../storage/storage"
import { set_current_tab } from "../storage/slices/navigationSlice"
class NavigationController{
    constructor(){
        this.navigation = store.getState().navigation
        this.unsubscribe = store.subscribe(() => {
                this.navigation = store.getState().navigation
        })
    }

    get_tabs_list(role){
        return this.navigation.tabs_list[role]
    }

    get_current_active_tab(){
        return this.navigation.current_tab
    }

    set_tab_active(tab_name){
        store.dispatch(set_current_tab(tab_name))
    }

    is_tab_active(tab_name){
        return (this.navigation.current_tab==tab_name)
    }
}

export const navigation_controller = new NavigationController()