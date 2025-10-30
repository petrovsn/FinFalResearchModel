import React from "react"
import { useState } from 'react';
import Select from 'react-select';
import { locales } from "../../static/locales"
import '../../styles/inputs.css'
class InputBase extends React.Component {
    constructor() {
        super()
        this.state = {
            "value": null,
            "validation": {
                "state": true,
                "description": ""
            },
        }
    }

    componentDidMount() {
        if (this.props.default_value) {
            let default_value = this.props.default_value
            this.setState({ "value": default_value })
        }
        if (this.props.validation) {
            let validity = this.props.validation(this.props.value)
            this.setState({ "validation": validity })
        }
    }

    get_value_from_event = (e) => {
        return e.target.value
    }

    onChange = (e) => {
        let value = this.get_value_from_event(e)
        console.log(value)
        if (this.props.onChange) {
            this.props.onChange(value)
        }
        let validity = true
        if (this.props.validation) {
            validity = this.props.validation(value)
        }

        this.setState({ "validation": validity })
    }

    get_warning_line = () => {
        if (!this.state.validation.state) {
            return <label className="warning_line">{locales.get(this.state.validation.description)}</label>
        }
        return <label></label>
    }

    get_content_line = () => {
        return <div className="content_line">
        </div>
    }

    get_className = () => {
        let classname = "InputFieldWidget"
        if (this.props.add_classname) classname = classname + " " + this.props.add_classname
        return classname
    }

    render() {
        return <div className={this.get_className()}>
            {this.get_content_line()}
            {this.get_warning_line()}
        </div>
    }
}

export class InputString extends InputBase {
    get_content_line = () => {
        return <div className="content_line">
            <label>{locales.get(this.props.label)}</label><input disabled={this.props.disabled} onChange={this.onChange} value={this.props.value}>
            </input>
        </div>
    }
}

export class InputInt extends InputBase {
    get_value_from_event = (e) => {
        return Number.parseInt(e.target.value)

    }
    get_content_line = () => {
        return <div className="content_line">
            <label>{locales.get(this.props.label)}</label><input disabled={this.props.disabled} type='number' onChange={this.onChange} value={this.props.value}></input>
        </div>
    }
}

export class InputCheckbox extends InputBase {
    get_value_from_event = (e) => {
        console.log(e)
        return e.target.checked
    }
    get_content_line = () => {
        return <div className="content_line checkbox_content_line">
            <label>{locales.get(this.props.label)}</label><input type="checkbox" disabled={this.props.disabled} onChange={this.onChange} checked={this.props.value}></input>
        </div>
    }

    render() {
        return <div className={this.get_className()+" "+this.get_className()+"_checkbox"}>
            {this.get_content_line()}
            {this.get_warning_line()}
        </div>
    }
}


export class InputSelector extends InputBase {
    get_value_from_event = (e) => {
        return e.target.value
    }

    get_options = () => {
        let options_list = [<option key={""} value={""}> ... </option>]
        for (let k in this.props.options) {
            let option = this.props.options[k]
            options_list.push(<option key={option} value={option}> {locales.get(option)} </option>)
        }
        return options_list
    }
    get_content_line = () => {
        return <div className="content_line">
            <label>{locales.get(this.props.label)}</label>
            <select key={this.state.triggerkey}
                onChange={this.onChange}>{this.get_options()}</select>

        </div>
    }

}


export class InputDatetime extends InputBase {

    //get_value_from_event = (e) => {
    //    return new Date(e.target.value).toISOString()
    // }


    get_content_line = () => {
        return <div className="content_line">
            <label>{locales.get(this.props.label)}</label>
            <input
                type="datetime-local"
                disabled={this.props.disabled}
                onChange={this.onChange} checked={this.props.value}
                value={this.props.value}>
            </input>

        </div>
    }
}

export class InputCheckBoxSelector extends React.Component {

    render() {
        return <div>
            <label>{locales.get(this.props.label)}</label>

        </div>
    }
}



export class SelectorFilter extends React.Component {

    get_inner_value = () => {
        let result = []
        if (this.props.value) {
            for (let i in this.props.value) {
                result.push({
                    "value": this.props.value[i],
                    "label": locales.get(this.props.value[i])
                })
            }
        }
        console.log("SelectorFilter.get_inner_value", result)
        return result
    }

    get_inner_options = () => {
        let result = []
        if (this.props.options) {
            for (let i in this.props.options) {
                result.push({
                    "value": this.props.options[i],
                    "label": locales.get(this.props.options[i])
                })
            }
        }
        return result
    }

    get_value_from_event = (e) => {
        let result = []
        for (let i in e) {
            result.push(e[i]["value"])
        }
        return result
    }

    onChange = (e) => {
        console.log("SelectorFilter.onChange", e)
        let value = this.get_value_from_event(e)
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }



    render() {
        return <div className="SelectorFilter">
            <div className="content_line">
                <label>{locales.get(this.props.label)}</label>
                <Select
                    isMulti
                    classNamePrefix="react-select"
                    options={this.get_inner_options()}
                    value={this.get_inner_value()}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    noOptionsMessage={() => locales.get("no_available_options")}
                />
            </div>
        </div>
    }
};


export class InputSlider extends InputBase {
    get_content_line = () => {
        return <div className="content_line content_line_slider">
            <label>{locales.get(this.props.label)}: {this.props.value}</label>
            <input className="slider_input"
            disabled={this.props.disabled} 
            onChange={this.onChange} 
            type="range" 
            min={this.props.min} max={this.props.max}
            step = {0.1}
            value={this.props.value} 
            class="slider"></input>
        </div>
    }
}