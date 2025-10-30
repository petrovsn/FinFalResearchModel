
import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class SciLogController extends CommonTableController {
    constructor() {
        super("logs")

    }

    get_keys = () => {
        return ["created_at", "subject_name", "action_type", "action_params"]
    }

    update_content = () => {
        finfal_rc.get_scilogs(
            this.filters["offset"],
            this.filters["count"]
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
        })
    }
}


export const scilog_table_controller = new SciLogController()