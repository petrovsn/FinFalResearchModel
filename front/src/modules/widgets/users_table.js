import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { InputSelector, InputString } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { user_table_controller } from "../../static/controllers/user_table_controller";
import { locales } from "../../static/locales";
import { ActionWrapper } from "./action_wrapper";
import { modal_controller } from "../../static/controllers/modal_controller";
export class UsersTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        user_table_controller.update_content()
    }

    on_create_user = () => {
        modal_controller.show(<UserCreator />)
    }

    on_import_users = () => {
        modal_controller.show(<UserCsvImporter />)
    }

    on_change_user = () => {
        modal_controller.show(<UserChanger item={user_table_controller.get_selected_item()} />)
    }

    get_actions_button = () => {
        let buttons_block = [
            <button onClick={user_table_controller.update_content}>{locales.get("update")}</button>,
            <button onClick={this.on_import_users}>{locales.get("import_users")}</button>,
            <button onClick={this.on_create_user}>{locales.get("create_user")}</button>
        ]
        if (user_table_controller.get_selected_item()) {
            buttons_block.push(<button onClick={this.on_change_user}>{locales.get("change")}</button>)
        }
        return <div className="table_actions_block">
            {buttons_block}
        </div>
    }

    render() {
        return <div className="UsersTable">
            {this.get_actions_button()}
            <CustomTableWidget table_controller={user_table_controller}></CustomTableWidget>
        </div>
    }
}


export class UserCreator extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "login": "",
            "name": "",
            "password": "",
            "role": ""
        }
    }

    on_create_user = () => {
        finfal_rc.create_user(this.state.login, this.state.name, this.state.password, this.state.role)
            .then(() => {
                user_table_controller.update_content()
                modal_controller.hide()
            }).catch((data) => {
                console.log(data["content"])
                this.onError(data["content"])
            })
    }

    get_buttons = () => {
        return <div className="modal_action_btn_panel">
            <button onClick={this.on_close}>{locales.get("close")}</button>
            <button onClick={this.on_create_user}>{locales.get("create_user")}</button>
        </div>

    }

    render() {
        let input_strs = []
        let keys = ["login", "name", "password"]
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            input_strs.push(<InputString label={key} onChange={(v) => { this.setState({ [key]: v }) }}
                value={this.state[key]} />)
        }

        input_strs.push(<InputSelector label={"role"}
            options={["master", "senior", "doctor", "subject"]}
            onChange={(v) => { this.setState({ "role": v }) }}
            value={this.state["role"]} />)

        return <div>
            {input_strs}
            {this.get_buttons()}
        </div>
    }
}


export class UserChanger extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            login: null,
            name: null,
            password: null,
            role: null,
            status: null,
            subject_id: null,
        }
    }

    componentDidMount() {
        this.setState({
            login: this.props.item.login,
            name: this.props.item.name,
            password: this.props.item.password,
            role: this.props.item.role,
            status: this.props.item.status,
            subject_id: this.props.item.subject_id,
        })
    }

    on_update_users = () => {
        finfal_rc.update_user(this.state.login, this.state)
            .then(() => {
                user_table_controller.update_content()
                modal_controller.hide()
            })
            .catch((data) => {
                console.log(data["content"])
                this.onError(data["content"])
            })
    }

    get_buttons = () => {
        return <div className="modal_action_btn_panel">
            <button onClick={this.on_close}>{locales.get("close")}</button>
            <button onClick={this.on_update_users}>{locales.get("create_user")}</button>
        </div>

    }

    render() {
        let input_strs = []
        let keys = ["login", "name", "password"]
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            input_strs.push(<InputString label={key} onChange={(v) => { this.setState({ [key]: v }) }}
                value={this.state[key]} />)
        }
        input_strs.push(<InputSelector label={"role"}
            options={["master", "senior", "doctor", "subject"]}
            onChange={(v) => { this.setState({ "role": v }) }}
            value={this.state["role"]} />)

        return <div>
            {input_strs}
            {this.get_buttons()}
        </div>
    }
}

class UserCsvImporter extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "csv_data": null
        }
    }

    uploadCsvContent = (event) => {
        let csv_texts = []
        if (event.target.files.length > 0) {
            let reader = new FileReader()
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                console.log(reader.result)
                csv_texts.push(reader.result)
                let text = reader.result.split("data:text/csv;base64,")[1]
                this.setState({ "csv_data": text })
            }
        }
    }

    get_action_text = () => {
        return <div className="CsrUploader_body">
            <input type="file" accept=".csv" onChange={this.uploadCsvContent} multiple />
        </div>
    }

    on_close = () => {
        modal_controller.hide()
    }

    on_import = () => {
        finfal_rc.import_users_csv(this.state.csv_data)
        .then(data=>{
            modal_controller.hide()
            user_table_controller.update_content()
        })
        .catch((data) => {
                console.log(data["content"])
                this.onError(data["content"])
            })
    }

    get_buttons_panel = () => {
        return <div className="modal_action_btn_panel">
            <button onClick={this.on_close}>{locales.get("close")}</button>
            <button disabled={this.state.csv_data == null} onClick={this.on_import}>{locales.get("import")}</button>
        </div>
    }
    render() {
        return <div className="UserActionTemplate">
            <h3>{locales.get("import_users_question")}</h3>
            {this.get_action_text()}
            {this.get_buttons_panel()}
        </div>
    }
}