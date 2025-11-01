import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class MutationProcessController extends CommonTableController {
    constructor() {
        super("mut_processes")
        //this.timer_id = setInterval(this.update_content, 1000);
    }

    get_keys = () => {
        return ["id", "created_at", "subject_id", "subject_name", "start_cell_stability", "finish_cell_stability", "mutation_class", "complexity", "result", "name", "status", "confirmation_code"] 
    }




    on_select = (item) => {
        store.dispatch(this.actions.select_item(item))
    }

    update_content = () => {

        finfal_rc.get_mutatation_processes(
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
            this.update_selected_item()
        })
    }
}

export const mut_process_controller = new MutationProcessController()