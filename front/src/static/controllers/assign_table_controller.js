import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class AssignTableController extends CommonTableController{
    constructor(){
        super("assigns")
        this.set_filters({
            "sname_filter":null,
        })
    }
    get_keys = () =>{
        return ["subject_id", "subject_name", "doctor_id", "doctor_name"]
    }

    update_content = () =>{
        finfal_rc.get_assignments(
            this.filters["offset"],
            this.filters["count"],
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
          })
    }


    get_available_actions = () =>{
        return []
    }
}

export const assign_table_controller = new AssignTableController()