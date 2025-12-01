import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class MutationsController extends CommonTableController {
    constructor() {
        super("mutations")
        //this.timer_id = setInterval(this.update_content, 1000);
    }

    get_keys = () => {
        return ["id", "name", "mutation_class", "description", "conditions"]
    }

    on_select = (item) => {
        store.dispatch(this.actions.select_item(item))
    }

    update_content = () => {

        finfal_rc.get_mutations(
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
            this.update_selected_item()
        })
    }
}

export const mutations_controller = new MutationsController()