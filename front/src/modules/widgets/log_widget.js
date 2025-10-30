import React from "react";
import { scilog_table_controller } from "../../static/controllers/log_controller";
import { InputString } from "./inputs";
import { locales } from "../../static/locales";
import { CustomTable, CustomTablePagingButtons } from "./table";
import '../../styles/scilog.css'
export class SciLogWidget extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        scilog_table_controller.update_content()
    }


    on_load_logs = () => {
        scilog_table_controller.update_content()
    }

    get_changes_card = () => {
        let selected_row = scilog_table_controller.get_selected_item()
        if (!selected_row) return <span></span>
        try {
            let result = <SubjectChangesCard
                subject_name={selected_row["subject_name"]}
                initial={JSON.parse(selected_row["initial_state"])}
                final={JSON.parse(selected_row["final_state"])} />
            return result
        }
        catch{

        }

        return  <span></span>

    }


    render() {
        return (<div className="SciLogWidget">

            <CustomTable
                keys={scilog_table_controller.get_keys()}
                content={scilog_table_controller.get_content()}
                marks={scilog_table_controller.get_selected_idxs()}
                on_item_select={scilog_table_controller.on_select}
            />
            <CustomTablePagingButtons
                current_page={scilog_table_controller.get_current_page()}
                on_prev_page={scilog_table_controller.on_prev_page}
                on_next_page={scilog_table_controller.on_next_page}
                on_change_row_count={scilog_table_controller.set_row_count}
            />
            {this.get_changes_card()}
        </div>)
    }
}


class SubjectChangesCard extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    get_stats_block = () => {
        let result = [



            <InputString disabled={true}
                label={locales.get("subject_name")}
                value={this.props.subject_name} />,

            <InputString disabled={true}
                label={locales.get("status")}
                value={this.props.initial["status"] + " -> " + this.props.final["status"]} />,

            <InputString disabled={true}
                label={locales.get("mental_stability")}
                value={this.props.initial["mental_stability"] + " -> " + this.props.final["mental_stability"]} />,

            <InputString disabled={true}
                label={locales.get("cell_stability")}
                value={this.props.initial["cell_stability"] + " -> " + this.props.final["cell_stability"]} />,

        ]

        for (let stat_name in this.props.initial["stats"]) {
            let stat_value_old = this.props.initial["stats"][stat_name]
            let stat_value_new = this.props.final["stats"][stat_name]
            result.push(<InputString disabled={true}
                label={locales.get(stat_name)}
                value={stat_value_old+" -> "+stat_value_new} />)
        }

        result.push(<InputString disabled={true}
            label={locales.get("mutations")}
            value={this.props.initial["mutations"]+ " -> " + this.props.final["mutations"]} />)

        return <div>
            {result}
        </div>
    }


    render() {
        return <div>
            {this.get_stats_block()}
        </div>
    }
}