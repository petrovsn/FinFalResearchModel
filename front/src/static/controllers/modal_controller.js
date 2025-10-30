import { store } from "../storage/storage"
import { hide_modal_content, show_modal_content } from "../storage/slices/modalSlice"
class ModalController{
    constructor(){
        this.modal = store.getState().modal
        this.unsubscribe = store.subscribe(() => {
                this.modal = store.getState().modal
        })
    }
    
    show = (widget)=>{
        store.dispatch(show_modal_content(widget))
    }

    hide = () =>{
        store.dispatch(hide_modal_content())
    }
}

export const modal_controller = new ModalController()