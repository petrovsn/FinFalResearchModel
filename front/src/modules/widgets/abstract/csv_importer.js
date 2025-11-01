import { ActionWrapper } from "./action_wrapper"
import { modal_controller } from "../../../static/controllers/modal_controller"
import { finfal_rc } from "../../../static/backend_api"
import { locales } from "../../../static/locales"
export class CsvImporter extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "csv_data": null,
            "question":"",
            "table_controller":null
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
            this.state.table_controller.update_content()
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
        return <div>
            <h3>{locales.get(this.state.question)}</h3>
            {this.get_action_text()}
            {this.get_buttons_panel()}
        </div>
    }
}