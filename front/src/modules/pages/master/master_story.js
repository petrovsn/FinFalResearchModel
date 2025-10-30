

import React from "react";
import { finfal_rc } from "../../../static/backend_api";
import { subjects_controller } from "../../../static/controllers/subjects_controller";
import '../../../styles/master_page.css'

import { AppLogWidget } from "../../widgets/applog_widget";
import { ServicesControlWidget } from "../../widgets/services_control_widget";
import { CustomTableWidget } from "../../widgets/table";
import { subjects_story_controller } from "../../../static/controllers/subjects_story_controller";
import { EventsTable } from "../../widgets/events_table";
export class MasterPage_Story extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="MasterPage">
            <CustomTableWidget table_controller = {subjects_story_controller}/>
            <EventsTable />
        </div>
    }
}