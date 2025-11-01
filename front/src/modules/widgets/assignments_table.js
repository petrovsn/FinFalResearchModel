import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { InputSelector, InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { ActionWrapper } from "./abstract/action_wrapper";
import { modal_controller } from "../../static/controllers/modal_controller";
import { assign_table_controller } from "../../static/controllers/assign_table_controller";

export class AssignsTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        assign_table_controller.update_content()
    }

    on_change_assignment = () => {
        modal_controller.show(<AssignChanger item={assign_table_controller.get_selected_item()} />)
    }

    get_actions_button = () => {
        let buttons_block = [
            <button onClick={assign_table_controller.update_content}>{locales.get("update")}</button>,
        ]
        if (assign_table_controller.get_selected_item()) {
            buttons_block.push(<button onClick={this.on_change_assignment}>{locales.get("chagne_asignment")}</button>)
        }
        return <div className="table_actions_block">
            {buttons_block}
        </div>
    }

    render() {
        return <div className="UsersTable">
            {this.get_actions_button()}
            <CustomTableWidget table_controller={assign_table_controller}></CustomTableWidget>
        </div>
    }
}


export class AssignChanger extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "doctors": [],
            "selected_doctor": null
        }
    }
    componentDidMount() {
        finfal_rc.get_users({"role":"doctor"}, null, null, null)
        .then(data => {
            let drs = []
            for (let i = 0; i < data.length; i++) {
                drs.push(data[i]["name"])
            }
            this.setState({ "doctors": drs })
        })
    }

    on_set_assignment= ()=>{
        finfal_rc.put_assignment(this.props.item.name, this.state["selected_doctor"])
        .then(
            ()=>{
                modal_controller.hide()
                assign_table_controller.update_content()
                subjects_controller.update_content()
            }
        )
        .catch((data) => {
                console.log(data["content"])
                this.onError(data["content"])
            })
    }

    get_buttons = () => {
        return <div className="modal_action_btn_panel">
            <button onClick={this.on_close}>{locales.get("close")}</button>
            <button onClick={this.on_set_assignment}>{locales.get("assign_doctor")}</button>
        </div>

    }


    render() {
        return <div>
            <InputString label = {"subject_name"} value = {this.props.item.name} disabled = {true}/>
            <InputSelector label={"doctor"}
                options={this.state.doctors}
                onChange={(v) => { this.setState({ "selected_doctor": v }) }}
                value={this.state["selected_doctor"]} />
            {this.get_buttons()}
        </div>
    }
}