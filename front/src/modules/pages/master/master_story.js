

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

export class MasterPage_Story extends React.Component {
    constructor() {
        super()
    }

    activate_event = () =>{
        modal_controller.show(<EventActivator 
            event = {events_table_controller.get_selected_item()}
            subject = {subjects_story_controller.get_selected_item()}
            />)
    }

    get_control_panel = () =>{
        return <div>
            <button onClick={this.activate_event}>{locales.get("activate_event")}</button>
        </div>
    }

    render() {
        return <div className="MasterPage">
            {this.get_control_panel()}
            <CustomTableWidget table_controller = {subjects_story_controller}/>
            <EventsTable />
        </div>
    }
}

class EventActivator extends ActionWrapper{
    on_activate_event = () =>{
        finfal_rc.put_activate_event(this.props.event.id, this.props.subject.id)
        .then(this.hide)
        .catch(data=>{this.onError(data)})
    }

    render(){
        return <div>

            <label>{locales.get("event_activator_question")}</label>
            {this.get_default_btn_panel("activate_event", this.on_activate_event)}
        </div>
    }
}