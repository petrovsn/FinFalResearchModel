import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class SubjectsStoryController extends CommonTableController {
    constructor() {
        super("subjects")
        //this.timer_id = setInterval(this.update_content, 1000);
    }

    get_keys = () => {
        return ["id", "name", "status", "doctor_name", "cell_stability", "mental_stability", "obsession", "jenova_cells", "mutations"] 
    }


    on_select = (item) => {
        store.dispatch(this.actions.select_item(item))
    }

    get_content() {
        let result = JSON.parse(JSON.stringify(this.content_data.content))
        for(let i in result){
            result[i]['obsession'] = (result[i]['jenova_cells']/(result[i]['jenova_cells']+result[i]['mental_stability'])).toFixed(2)
        }
        return result
    }

    update_content = () => {

        finfal_rc.get_available_subjects(
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
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

export const subjects_story_controller = new SubjectsStoryController()