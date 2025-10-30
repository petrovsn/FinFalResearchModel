import React from "react";

import { InputDatetime, InputString } from "./inputs";
import { locales } from "../../static/locales";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import '../../styles/scilog.css'
import { applog_table_controller } from "../../static/controllers/applog_table_controller";
export class AppLogWidget extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        applog_table_controller.update_content()
    }


    on_load_logs = () => {
        applog_table_controller.update_content()
    }


    get_filters_layer = () =>{
        return <div style={{
            "display":"flex",
            "flex-directiom":"row",
            "border": "1px solid black",
        }}>
            <InputDatetime label = 'not_before' onChange = {applog_table_controller.set_not_before}/>
            <InputDatetime label = 'not_after' onChange = {applog_table_controller.set_not_after}/>
            <InputString label = 'user' onChange = {(value)=>{applog_table_controller.set_filters({"user":value})}}></InputString>
        </div>
    }

    get_control_panel = () =>{
        return <div className="control_panel">
            <button onClick={applog_table_controller.update_content}>{locales.get("update")}</button>
        </div>
    }

    render() {
        return (<div className="AppLogWidget">
            <b>LogTable</b>
            {this.get_filters_layer()}
            {this.get_control_panel()}
            <CustomTableWidget
                table_controller = {applog_table_controller}
            />
        </div>)
    }
}

