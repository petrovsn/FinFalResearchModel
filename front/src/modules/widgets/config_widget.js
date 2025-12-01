
import React from "react";
import { finfal_rc } from "../../static/backend_api";
import { InputString } from "./inputs";

import '../../styles/config_widget.css'

export class ConfigWidget extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    componentDidMount() {
        this.update_config()
    }

    update_config = () => {
        finfal_rc.get_config().then(data => this.setState(data))
    }

    set_value = (section_key, key, value) =>{
        let tmp = this.state[section_key]
        tmp[key] = value
        this.setState({[section_key]:tmp})
    }

    get_section_key = (section_key) => {
        let result = []

        for (let key in this.state[section_key]) {
            result.push(<InputString label={key} 
            value = {this.state[section_key][key]}
            onChange = {value => {this.set_value(section_key,key,value)}}
            />)
        }

        return <div className="section"><h5>{section_key}</h5>{result}</div>
    }

    get_body = () => {
        let result = []
        for (let section_key in this.state) {
            if (!["DEFAULT", "services"].includes(section_key)) {
                result.push(this.get_section_key(section_key))
            }

        }
        return <div className="body">{result}</div>
    }

    on_save = () =>{
        finfal_rc.post_config(this.state)
    }

    get_btns = () =>{
        return <div>
            <button onClick={this.on_save}>save</button>
        </div>
    }

    render() {
        return <div className="ConfigWidget">
            <h4>Configs</h4>
            {this.get_body()}
            {this.get_btns()}
        </div>
    }
}