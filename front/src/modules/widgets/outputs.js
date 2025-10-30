import React from "react"
import '../../styles/output.css'
import { locales } from "../../static/locales"
export class StringViewer extends React.Component{    
    render(){
        return <div>
            <label>{this.props.label}</label><label>{this.props.value}</label>
        </div>
    }
}


