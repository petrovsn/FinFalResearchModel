import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { tasks_table_controller } from "../../static/controllers/tasks_controller";
import { InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { mut_process_controller } from "../../static/controllers/mut_process_controller";
import { mutations_controller } from "../../static/controllers/mutation_controller";
import { ActionWrapper } from "./abstract/action_wrapper";
import { modal_controller } from "../../static/controllers/modal_controller";
import { CsvImporter } from "./abstract/csv_importer";
export class MutProcessesTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        mut_process_controller.update_content()
    }



    get_button_panel = () => {
        let result = []
        result.push(<button onClick={tasks_table_controller.update_content}>{locales.get("update")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={mut_process_controller}
            />
        </div>
    }
}

export class MutationsTable extends React.Component{
        constructor() {
        super()
    }

    componentDidMount() {
        mutations_controller.update_content()
    }

    on_create = () =>{
        modal_controller.show(<MutationCreator/>)
    }

    on_import = () => {
        modal_controller.show(<MutationsCsvImporter/>)
    }


    get_button_panel = () => {
        let result = []
        result.push(<button onClick={mutations_controller.update_content}>{locales.get("update")}</button>)
        result.push(<button onClick={this.on_create}>{locales.get("create")}</button>)
        result.push(<button onClick={this.on_import}>{locales.get("import")}</button>)
        return <div className="ActionPanel">{result}</div>
    }

    render() {
        return <div className="TasksPage">
            {this.get_button_panel()}
            <CustomTableWidget
                table_controller={mutations_controller}
            />
        </div>
    }
}


class MutationCreator extends ActionWrapper{
    constructor(){
        super()
        this.state = {
            name:"",
            description:"",
            effect:"",
            conditions:""
        }
    }

    on_create = () =>{
        finfal_rc.post_mutation(this.state.name,
            this.state.description,
            this.state.effect,
            this.state.conditions)
        .then(modal_controller.hide)
        .catch(data=>{this.onError(data.content)})
    }

    get_body = () =>{
        return <div>
            <InputString 
            label = "name"
            value = {this.state.name}
            onChange = {v=>{this.setState({"name":v})}}/>
            <InputString 
            label = "description"
            value = {this.state.description}
            onChange = {v=>{this.setState({"description":v})}}/>
            <InputString 
            label = "effect"
            value = {this.state.effect}
            onChange = {v=>{this.setState({"effect":v})}}/>
            <InputString 
            label = "conditions"
            value = {this.state.conditions}
            onChange = {v=>{this.setState({"conditions":v})}}/>
        </div>
    }

    render(){
        return <div>
            {this.get_body()}
            {this.get_default_btn_panel("create", this.on_create)}
        </div>
    }
}

class MutationsCsvImporter extends CsvImporter {
        constructor(){
            super()
            this.state = {
                "question":"import_mutations_question"
            }
        }
    
        on_import = () => {
            finfal_rc.import_mutations_csv(this.state.csv_data)
            .then(data=>{
                modal_controller.hide()
                mutations_controller.update_content()
            })
            .catch((data) => {
                    console.log(data["content"])
                    this.onError(data["content"])
                })
        }
    }