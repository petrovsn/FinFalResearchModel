import React from "react";
import { finfal_rc } from "../../../static/backend_api";
import { subjects_controller } from "../../../static/controllers/subjects_controller";


import '../../../styles/master_page.css'
import { SubjectsTable } from "../../widgets/subjects_table";
import { TasksTable } from "../../widgets/tasks_table";
import { MutProcessesTable } from "../../widgets/mutations_table";
export class MasterPage_Bio extends React.Component {
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
             <SubjectsTable mode = {"master"}/>
             <TasksTable/>
             <MutProcessesTable/>
        </div>
    }
}