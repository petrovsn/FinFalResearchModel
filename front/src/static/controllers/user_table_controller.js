import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class UserTableController extends CommonTableController{
    constructor(){
        super("users")
        this.set_filters({
            "role":null,
        })
    }
    get_keys = () =>{
        return ["id", "login", "name", "role", "status", "subject_id"]
    }




    update_content = () =>{
        finfal_rc.get_users(
            null,
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
          })
    }

    get_available_actions = () =>{
        let selected_item = this.get_selected_item()
        if (selected_item==null) return []
        if (!("id" in selected_item)) return []
        if (selected_item["is_active"])
            return ["set_role", "ban",  "delete"]
        return ["set_role", "unban", "delete"]
    }
}

export const user_table_controller = new UserTableController()