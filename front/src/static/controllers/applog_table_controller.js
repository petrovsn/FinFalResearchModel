
import { store } from "../storage/storage"
import { finfal_rc, minica2 } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class AppLogController extends CommonTableController {
    constructor() {
        super("logs")
        this.set_filters({
            'not_before': null,
            'not_after': null,
            "user": null,
            "action": null,
            "result": null,
        })
    }

    set_not_before = (value) =>{
        this.filters["not_before"] = value
    }

    set_not_after = (value) =>{
        this.filters["not_after"] = value
    }

    get_keys = () => {
        return ["id", "created_at", "level", "user", "url", "action", "params", "result", "comments", ""]
    }

    update_content = () => {
        //let time_filters = this.get_time_intervals()
        finfal_rc.get_logs(
            this.filters["not_before"],
            this.filters["not_after"],
            this.filters["user"],
            this.filters["action"],
            this.filters["result"],
            this.filters["offset"],
            this.filters["count"],
            null, //this.sorting,
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
        })
    }
}


export const applog_table_controller = new AppLogController()