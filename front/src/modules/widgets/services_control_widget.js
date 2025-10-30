import React from "react";
import { finfal_rc } from "../../static/backend_api";
import { InputCheckbox, InputCheckBoxSelector, InputInt } from "./inputs";
import '../../styles/service_control_widget.css'
import { locales } from "../../static/locales";
export class ServicesControlWidget extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    componentDidMount() {
        this.update_state()
    }

    update_state = () => {
        finfal_rc.get_services_state().then(data => {
            this.setState(data)
        })
    }

    on_commit = (service_name) => {
        console.log("on_commit", this.state)
        finfal_rc.set_service_state(service_name, this.state[service_name][1])
        .then(d=>{
            finfal_rc.set_service_timeout(service_name, this.state[service_name][0]).catch()
        })
        .catch()
    }

    on_change_state = (service_name, value) => {
        let tmp = this.state[service_name]
        tmp[1] = value
        this.setState({ [service_name]: tmp })
    }

    on_change_timeout = (service_name, value) => {
        let tmp = this.state[service_name]
        tmp[0] = value
        this.setState({ [service_name]: tmp })
    }

    get_serice_control = (service_name) => {
        return <div className="ServiceControlUnit">
            <label>{service_name}</label>
            <InputCheckbox label="is_alive" onChange={v => { this.on_change_state(service_name, v) }}
                value={this.state[service_name][1]} />
            <InputInt label="timeout" onChange={v => { this.on_change_timeout(service_name, v) }}
                value={this.state[service_name][0]} />
            <button onClick={()=>{this.on_commit(service_name)}}>{locales.get("commit")}</button>
        </div>
    }

    get_control_block = () => {
        return <div>
            <b>ServicesControlWidget</b><b>   </b>
            <button onClick={this.update_state}>update</button>
        </div>
    }

    render() {
        let result = []
        for (let service_name in this.state) {
            result.push(this.get_serice_control(service_name))
        }
        return <div className="ServicesControlWidget">

            {this.get_control_block()}
            {result}
        </div>
    }
}