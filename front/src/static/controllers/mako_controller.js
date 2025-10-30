import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";
import { add_new_block, delete_block, set_block_params, update_prediction } from "../storage/slices/makoSlice";
import { subjects_controller } from "./subjects_controller";
class MakoController{
    constructor() {
        this.mako = store.getState().mao
        this.unsubscribe = store.subscribe(() => {
                this.mako = store.getState().mako
        })
    }

    get_content(tissue_type) {
        return this.mako.mako_blocks[tissue_type]
    }

    add_mako_block = (tissue_type) =>{
        store.dispatch(add_new_block({"tissue_type":tissue_type}))
    }

    delete_mako_block = (tissue_type, idx) =>{
        store.dispatch(delete_block({"tissue_type":tissue_type, "idx":idx}))
    }

    update_mako_block = (tissue_type, idx, params) => {
        store.dispatch(set_block_params({"tissue_type":tissue_type, "idx":idx, "params":params}))
    }

    create_subject(name, stats){
        finfal_rc.create_subject(name, stats).then((data)=>{this.update_content()})
    }
    async apply_emission(subject_id){
        if (!subject_id) return
        finfal_rc.apply_mako_emission(subject_id, this.mako.mako_blocks).then(
            (data) =>{
                store.dispatch(update_prediction(data))
            }
        ).then(
            (data) =>{
                subjects_controller.update_content();
            }
        )
    }



    get_prediction(){
        return this.mako.mako_prediction
    }
}

export const mako_controller = new MakoController()