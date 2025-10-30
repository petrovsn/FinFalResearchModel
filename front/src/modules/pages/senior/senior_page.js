import React from "react";

import '../../../styles/master_page.css'
import { AssignsTable } from "../../widgets/assignments_table";
import { SubjectsTable } from "../../widgets/subjects_table";



export class SeniorPage extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="SeniorPage">
            <SubjectsTable mode = {"senior"}/>
        </div>
    }
}