
import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";


class TasksTableController extends CommonTableController {
    constructor() {
        super("tasks")
    }

    get_keys = () => {
        return ["id", "created_at", "subject_id", "subject_name", "status", "m_injection", "complexity", "f1_score", "task_numbers"]
    }

    get_content() {
        let result = JSON.parse(JSON.stringify(this.content_data.content))
        for (let i in result) {

            result[i]["m_injection"] = JSON.stringify(result[i]["m_injection"])
            result[i]["task_numbers"] = JSON.stringify(result[i]["task_numbers"])
            result[i]["input_numbers"] = JSON.stringify(result[i]["input_numbers"])
        }
        return result
    }

    update_content = () => {
        finfal_rc.get_tasks(
            null,
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
        })
    }
}


export const tasks_table_controller = new TasksTableController()