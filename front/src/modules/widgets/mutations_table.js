import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { tasks_table_controller } from "../../static/controllers/tasks_controller";
import { InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { mutations_controller } from "../../static/controllers/mutations_controller";
export class MutationsTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        mutations_controller.update_content()
    }



    get_button_panel = () => {
        let result = []
        result.push(<button onClick={tasks_table_controller.update_content}>{locales.get("update")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={mutations_controller}
            />
        </div>
    }
}