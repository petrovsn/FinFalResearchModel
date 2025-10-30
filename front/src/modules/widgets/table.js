import React from "react";
import { locales } from "../../static/locales";
import { time_viewer } from "../../static/viewers";
import { InputSelector } from "./inputs";
import '../../styles/table.css'

export class CustomTable extends React.Component {
    constructor() {
        super()
        this.state = {
            timer_id: null
        }
    }
    is_key_in_no_locales = (key) => {
        return ["profile_name", "user", "action", "params", "login"].includes(key)
    }

    get_sorting_key_widget = (key) => {
        if (this.props.table_controller)
            if (key) {
                let current_sort = this.props.table_controller.get_sorting_key()
                if (current_sort["key"] == key) {
                    if (current_sort["desc"] == true)
                        return "▽"
                    else
                        return "△"
                }
            }
        return ""

    }

    componentDidMount() {
        if (this.props.table_controller) {
            let timer_id = setInterval(this.props.table_controller.update_content, 1000)
            this.setState({ "timer_id": timer_id })
        }

    }

    componentWillUnmount() {
        clearInterval(this.state.timer_id)
    }

    get_header = () => {
        let headers = []

        let current_sort = null
        if (this.props.table_controller) current_sort = this.props.table_controller.get_sorting_key()

        for (let i in this.props.keys) {
            headers.push(<th onClick={() => { this.props.table_controller.set_sorting_key(this.props.keys[i]) }}>
                {locales.get(this.props.keys[i])} {this.get_sorting_key_widget(this.props.keys[i])}
            </th>)
        }
        return <thead><tr>{headers}</tr></thead>
    }

    on_row_click = (item) => {
        if (this.props.on_item_select) {
            this.props.on_item_select(item)
        }
    }

    get_row_classname = (row_idx) => {
        if (this.props.marks) {
            if (this.props.marks.includes(row_idx)) {
                return "table_row_marked"
            }
        }
        return ""
    }

    apply_viewers = (key, data) => {
        if (this.props.cell_viewers)
            if (key in this.props.cell_viewers) {
                return this.props.cell_viewers[key](data)
            }
        if (["created_at", "last_login_time", "last_password_change_time"].includes(key))
            return time_viewer(data)
        return data
    }

    get_body = () => {
        let body = []
        for (let i in this.props.content) {
            let row = []
            for (let j in this.props.keys) {
                let key = this.props.keys[j]
                let cell_data = this.props.content[i][key]
                let cell_data_viewed = this.apply_viewers(key, cell_data)
                if (!this.is_key_in_no_locales(key)) {
                    row.push(<td title={locales.get(cell_data_viewed)}>{locales.get(cell_data_viewed)}</td>)
                }
                else {
                    row.push(<td title={cell_data_viewed}>{cell_data_viewed}</td>)
                }

            }
            let class_name = this.get_row_classname(i)
            body.push(<tr className={class_name} onClick={(e) => { this.on_row_click(this.props.content[i]) }}>{row}</tr>)
        }
        return <tbody>{body}</tbody>
    }

    render() {
        return <table className="CustomTable">
            {this.get_header()}
            {this.get_body()}
        </table>
    }
}




export class CustomTablePagingButtons extends React.Component {

    get_options = () => {
        let options = [10, 20, 30, 40, 50]
        let options_list = []
        for (let k in options) {
            let option = options[k]
            options_list.push(<option key={option} value={option}> {option} </option>)
        }
        return options_list
    }

    onChange = (e) => {
        if (this.props.on_change_row_count) {
            this.props.on_change_row_count(e.target.value)
        }
    }

    render() {
        return <div className="CustomTablePagingButtons">
            <button onClick={this.props.on_prev_page}>{"<<"}</button>
            <label>{this.props.current_page}</label>

            <div className="row_count_block">
                <label>{locales.get("row_count")}</label>
                <select
                    onChange={this.onChange}>{this.get_options()}</select>
            </div>
            <button onClick={this.props.on_next_page}>{">>"}</button>
        </div>
    }
}

export class CustomTableWidget extends React.Component {
    render() {
        return <div className="CustomTableWidget">
            <CustomTable
                table_controller={this.props.table_controller}
                keys={this.props.table_controller.get_keys()}
                content={this.props.table_controller.get_content()}
                marks={this.props.table_controller.get_selected_idxs()}
                on_item_select={this.props.table_controller.on_select}
            />
            <CustomTablePagingButtons
                current_page={this.props.table_controller.get_current_page()}
                on_prev_page={this.props.table_controller.on_prev_page}
                on_next_page={this.props.table_controller.on_next_page}
                on_change_row_count={this.props.table_controller.set_row_count}
            />
        </div>
    }
}