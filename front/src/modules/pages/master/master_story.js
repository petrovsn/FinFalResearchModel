

import React from "react";
import { finfal_rc } from "../../../static/backend_api";
import { subjects_controller } from "../../../static/controllers/subjects_controller";
import '../../../styles/master_page.css'
import { locales } from "../../../static/locales";
import { AppLogWidget } from "../../widgets/applog_widget";
import { ServicesControlWidget } from "../../widgets/services_control_widget";
import { CustomTableWidget } from "../../widgets/table";
import { subjects_story_controller } from "../../../static/controllers/subjects_story_controller";
import { EventsTable } from "../../widgets/events_table";
import { ActionWrapper } from "../../widgets/abstract/action_wrapper";
import { modal_controller } from "../../../static/controllers/modal_controller";
import { events_table_controller } from "../../../static/controllers/events_controller";
import { StimsTable } from "../../widgets/stims_table";

export class MasterPage_Story extends React.Component {
    constructor() {
        super()
    }

    get_control_panel = () => {
        let result = []
        result.push(<button onClick={subjects_story_controller.update_content}>{locales.get("update")}</button>)
        return <div className="ActionPanel">{result}</div>
    }


    render() {
        return <div className="MasterPage">
            <h3>{locales.get("Subjects[StoryMode]")}</h3>
            {this.get_control_panel()}
            <CustomTableWidget table_controller = {subjects_story_controller}/>
            <EventsTable />
            <StimsTable />
        </div>
    }
}

