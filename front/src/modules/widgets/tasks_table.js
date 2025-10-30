import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { tasks_table_controller } from "../../static/controllers/tasks_controller";
import { InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
export class TasksTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        tasks_table_controller.update_content()
    }

    on_deactivate = () => {
        let active_task = tasks_table_controller.get_selected_item()
        finfal_rc.set_task_status(active_task["id"], "cancelled").then(() => { tasks_table_controller.update_content() })
    }

    get_button_panel = () => {
        let result = []
        result.push(<button onClick={tasks_table_controller.update_content}>{locales.get("update")}</button>)
        result.push(<button onClick={this.on_deactivate}>{locales.get("deactivate")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={tasks_table_controller}
            />
        </div>
    }
}