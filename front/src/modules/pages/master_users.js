import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "../widgets/subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { InputString } from "../widgets/inputs";
import { user_table_controller } from "../../static/controllers/user_table_controller";
import { CustomTable, CustomTablePagingButtons} from "../widgets/table";
export class MasterPage_Users extends React.Component {
    constructor() {
        super()
    }

    on_create_user = () =>{

    }

    get_actions_button = () => {
        return <div>
            <button onClick={this.on_create_user}>create</button>
       </div>
    }

    render() {
        return <div className="MasterPage">
            {this.get_actions_button()}
            <CustomTable
                keys={user_table_controller.get_keys()}
                content={user_table_controller.get_content()}
                marks={user_table_controller.get_selected_idxs()}
                on_item_select={user_table_controller.on_select}
            />
            <CustomTablePagingButtons
                current_page={user_table_controller.get_current_page()}
                on_prev_page={user_table_controller.on_prev_page}
                on_next_page={user_table_controller.on_next_page}
            />
        </div>
    }
}



