import React from "react";
import { SubjectsTable } from "../../widgets/subjects_table";
import { SciLogWidget } from "../../widgets/log_widget";



export class DoctorPage extends React.Component {

    render() {
        return <div>

            <SubjectsTable mode = 'doctor'/>
            <SciLogWidget />

        </div>
    }
}