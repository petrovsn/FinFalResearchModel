import React from "react"
import { InputSelector, InputString} from "./inputs"
import { scilog_table_controller } from "../../static/controllers/log_controller"
import '../../styles/filters.css'

export class FiltersLayerWidget extends React.Component {
    constructor() {
        super()
    }

    on_set_filter = (key, value) => {
        this.props.table_controller.set_filters({ [key]: value })
        this.props.table_controller.update_content()
    }




    render() {
        return <div className="FiltersLayerWidget">
            <InputString
                label="subject_name"
                value={this.props.table_controller.get_filters()["sname_filter"]}
                onChange={(value) => { this.on_set_filter("sname_filter", value) }}
            />
            <InputSelector label="status" onChange = {(value)=>{this.on_set_filter("status",value)}} options = {this.props.selector_options}/>
        </div>
    }
}


export class LogFitlerLayerWidget extends React.Component {
    constructor() {
        super()
    }

    on_set_filter = (key, value) => {
        scilog_table_controller.set_filters({ [key]: value })
        scilog_table_controller.update_content()
    }


    render() {
        return <div className="FiltersLayerWidget">
            <InputString
                label="user"
                value={scilog_table_controller.get_filters()["user"]}
                onChange={(value) => { this.on_set_filter("user", value) }}
            />
            <InputString
                label="action"
                value={scilog_table_controller.get_filters()["action"]}
                onChange={(value) => { this.on_set_filter("action", value) }}
            />
            <InputSelector 
            label="result" 
            onChange = {(value)=>{this.on_set_filter("result",value)}} 
            options = {this.props.selector_options}/>
        </div>
    }
}