import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { modal_controller } from "../../static/controllers/modal_controller";
import { InputCheckbox, InputSelector, InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { events_table_controller } from "../../static/controllers/events_controller";
import { CsvImporter } from "./abstract/csv_importer";

export class EventsTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        events_table_controller.update_content()
    }

    on_create_event = () =>{
        modal_controller.show(<EventCreator/>)
    }

    on_import_events =() =>{
        modal_controller.show(<EventsCsvImporter/>)
    }

    get_button_panel = () => {
        let result = []
        result.push(<button onClick={events_table_controller.update_content}>{locales.get("update")}</button>)
        result.push(<button onClick={this.on_create_event}>{locales.get("create")}</button>)
        result.push(<button onClick={this.on_import_events}>{locales.get("import")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={events_table_controller}
            />
        </div>
    }
}


class EventCreator extends React.Component{
    constructor(){
        super()
        this.state = {
            event_type:"",
            multiple:false,
            name:"",
            description:"",
        }
    }

    post_event = () =>{
        finfal_rc.post_event(this.state.event_type, 
            this.state.multiple, 
            this.state.name, 
            this.state.description
        )
    }

    get_body = () =>{
        return <div>
            <InputString label = "name" onChange = {v=>{this.setState({"name":v})}}/>
            <InputSelector label = "event_type" options = {["story", "stim"]} onChange = {v=>{this.setState({"event_type":v})}}/>
            <InputString label = "description" onChange = {v=>{this.setState({"description":v})}}/>
            <InputCheckbox label = "multiple" onChange = {v=>{this.setState({"multiple":v})}} />
        </div>
    }

    get_controls = () =>{
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.post_event}>{locales.get("create")}</button>
        </div>
    }

    render(){
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>
    }
}


class EventsCsvImporter extends CsvImporter {
        constructor(){
            super()
            this.state = {
                "question":"import_events_question",
            }
        }
    
        on_import = () => {
            finfal_rc.import_events_csv(this.state.csv_data)
            .then(data=>{
                modal_controller.hide()
                events_table_controller.update_content()
            })
            .catch((data) => {
                    console.log(data["content"])
                    this.onError(data["content"])
                })
        }
    }