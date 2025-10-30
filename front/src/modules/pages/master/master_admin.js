import React from "react";
import { finfal_rc } from "../../../static/backend_api";
import { subjects_controller } from "../../../static/controllers/subjects_controller";
import { UsersTable } from "../../widgets/users_table";


import '../../../styles/master_page.css'
import { SciLogWidget } from "../../widgets/log_widget";
export class MasterPage_Admin extends React.Component {
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
            <UsersTable></UsersTable>
            <SciLogWidget></SciLogWidget>
        </div>
    }
}