

import React from "react";
import { finfal_rc } from "../../../static/backend_api";
import { subjects_controller } from "../../../static/controllers/subjects_controller";
import '../../../styles/master_page.css'

import { AppLogWidget } from "../../widgets/applog_widget";
import { ServicesControlWidget } from "../../widgets/services_control_widget";
export class MasterPage_System extends React.Component {
    constructor() {
        super()
    }

    get_actions_button = () => {
        return <div>
            <button onClick={() => { finfal_rc.next_phase().then(() => { subjects_controller.update_content() }).catch() }}>NEXT PHAZE</button>
        </div>
    }



    render() {
        return <div className="MasterPage">
            <ServicesControlWidget/>
            <AppLogWidget />
        </div>
    }
}