import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { modal_controller } from "../../static/controllers/modal_controller";
import { InputCheckbox, InputInt, InputSelector, InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { CsvImporter } from "./abstract/csv_importer";
import { stims_table_controller } from "../../static/controllers/stims_controller";

export class StimsTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        stims_table_controller.update_content()
    }

    on_create_Stim = () =>{
        modal_controller.show(<StimCreator/>)
    }

    on_import_Stims =() =>{
        modal_controller.show(<StimsCsvImporter/>)
    }

    get_button_panel = () => {
        let result = []
        result.push(<button onClick={stims_table_controller.update_content}>{locales.get("update")}</button>)
        result.push(<button onClick={this.on_create_Stim}>{locales.get("create")}</button>)
        result.push(<button onClick={this.on_import_Stims}>{locales.get("import")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            <h3>{locales.get("Stims")}</h3>
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={stims_table_controller}
            />
        </div>
    }
}


class StimCreator extends React.Component{
    constructor(){
        super()
        this.state = {
            tissue_type:"",
            mako_volume:0
        }
    }

    post_Stim = () =>{
        finfal_rc.post_stim(this.state.tissue_type, 
            this.state.mako_volume, 
        )
    }

    get_body = () =>{
        return <div>
            <InputSelector label = "Stim_type" options = {["blood", "nerves", "muscules"]} onChange = {v=>{this.setState({"tissue_type":v})}}/>
            <InputInt label = "description" onChange = {v=>{this.setState({"description":v})}}/>
        </div>
    }

    get_controls = () =>{
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.post_Stim}>{locales.get("create")}</button>
        </div>
    }

    render(){
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>
    }
}


class StimsCsvImporter extends CsvImporter {
        constructor(){
            super()
            this.state = {
                "question":"import_stims_question",
            }
        }
    
        on_import = () => {
            finfal_rc.import_stims_csv(this.state.csv_data)
            .then(data=>{
                modal_controller.hide()
                stims_table_controller.update_content()
            })
            .catch((data) => {
                    console.log(data["content"])
                    this.onError(data["content"])
                })
        }
    }