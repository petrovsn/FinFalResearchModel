import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class SubjectsController extends CommonTableController {
    constructor() {
        super("subjects")
        //this.timer_id = setInterval(this.update_content, 1000);
    }

    get_keys = () => {
        return ["id", "name", "status", "doctor_name", "cell_stability", "mental_stability", "stats_health", "stats_reaction", "stats_strength", "jenova_cells", "mutations", "next_mutation"] 
    }


    on_select = (item) => {
        store.dispatch(this.actions.select_item(item))
    }

    update_content = () => {

        finfal_rc.get_available_subjects(
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            for(let i in data){
                let mut_str = ""
                for(let j in data[i]["mutations"]){
                    mut_str = mut_str+data[i]["mutations"][j]+"; "
                }
                data[i]["mutations"] = mut_str
            }
            store.dispatch(this.actions.set_content(data))
            this.update_selected_item()
        })
    }

    create_subject(name) {
        finfal_rc.create_subject(name).then((data) => { this.update_content() })
    }

    delete(item) {
        if (!item) return
        finfal_rc.delete_subject(item["id"]).then(() => { this.update_content() })
    }
}

export const subjects_controller = new SubjectsController()