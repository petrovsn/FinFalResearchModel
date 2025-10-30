import React from "react";
import { locales } from "../../static/locales"
import { InputString, InputInt } from "./inputs";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { ReduxMemoryAccess } from "./memory_redux_access";
import '../../styles/subjects.css'

export class SubjectsWidget extends ReduxMemoryAccess {

    componentDidMount() {
        subjects_controller.update_content()
    }

    get_subjects_cards() {
        let result = [<button onClick={subjects_controller.update_content}>UPDATE</button>,]
        let content = subjects_controller.get_content()
        for (let i in content) {
            if (this.props.master_mode) {
                result.push(<SubjectMasterCard item={content[i]} />)
            }
            else {
                result.push(<SubjectCard item={content[i]} />)
            }

        }
        result.push(<SubjectCardCreator />)
        return result
    }

    render() {
        return <div className="SubjectsWidget">
            {this.get_subjects_cards()}
        </div>
    }
}


class SubjectCard extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    get_stats_block = () => {
        let result = [
            <InputString disabled={true}
                label={locales.get("subject_name")}
                value={this.props.item["name"]} />,

            <InputString disabled={true}
                label={locales.get("status")}
                value={this.props.item["status"]} />,

            <InputString disabled={true}
                label={locales.get("mental_stability")}
                value={this.props.item["mental_stability"]} />,

            <InputString disabled={true}
                label={locales.get("cell_stability")}
                value={this.props.item["cell_stability"]} />,


        ]

        for (let stat_name in this.props.item["stats"]) {
            let stat_value = this.props.item["stats"][stat_name]
            result.push(<InputString disabled={true}
                label={locales.get(stat_name)}
                value={stat_value} />)
        }

        result.push(<InputString disabled={true}
            label={locales.get("mutations")}
            value={this.props.item["mutations"]} />)

        return <div>
            {result}
        </div>
    }

    on_select = () => {
        subjects_controller.on_select(this.props.item)
    }

    on_delete = () => {
        subjects_controller.delete(this.props.item)
    }

    get_control_block = () => {
        return <div className="btn_control_block">
            <button onClick={this.on_select}>{locales.get("select")}</button>
            <button onClick={this.on_delete}>{locales.get("delete")}</button>
        </div>
    }

    get_class_name = () => {
        let className = "SubjectCard"
        if (subjects_controller.get_selected_item())
            if (subjects_controller.get_selected_item()["id"] == this.props.item["id"]) {
                className = className + " SubjectCard_selected"
            }
        return className
    }

    render() {
        return <div className={this.get_class_name()}>
            {this.get_stats_block()}
            {this.get_control_block()}
        </div>
    }
}


class SubjectMasterCard_tissue_subcard extends React.Component {
    constructor() {
        super()
    }

    render() {
        let tissue_type = this.props.tissue_type
        return <div>
            <label>{tissue_type}</label>
            <InputString disabled={true} label="current_evo_stage"
                value={this.props.item.tissues[tissue_type].current_evo_stage} />
            <InputString disabled={true} label="current_mako_level"
                value={this.props.item.tissues[tissue_type].current_mako_level} />
            <InputString disabled={true} label="stat"
                value={this.props.item.stats[tissue_type]} />
        </div>
    }

}

class SubjectMasterCard extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    get_stats_block = () => {
        let result = [



            <InputString disabled={true}
                label={locales.get("subject_name")}
                value={this.props.item["name"]} />,

            <InputString disabled={true}
                label={locales.get("status")}
                value={this.props.item["status"]} />,

            <InputString disabled={true}
                label={locales.get("mental_stability")}
                value={this.props.item["mental_stability"]} />,

            <InputString disabled={true}
                label={locales.get("cell_stability")}
                value={this.props.item["cell_stability"]} />,


        ]

        for (let stat_name in this.props.item["stats"]) {
            let stat_value = this.props.item["stats"][stat_name]
            result.push(<SubjectMasterCard_tissue_subcard disabled={true} item = {this.props.item} tissue_type={stat_name}/>)
        }

        result.push(<InputString disabled={true}
            label={locales.get("mutations")}
            value={this.props.item["mutations"]} />)

        return <div>
            {result}
        </div>
    }

    on_select = () => {
        subjects_controller.on_select(this.props.item)
    }

    on_delete = () => {
        subjects_controller.delete(this.props.item)
    }

    get_control_block = () => {
        return <div className="btn_control_block">
            <button onClick={this.on_select}>{locales.get("select")}</button>
            <button onClick={this.on_delete}>{locales.get("delete")}</button>
        </div>
    }

    get_class_name = () => {
        let className = "SubjectCard"
        if (subjects_controller.get_selected_item())
        if (subjects_controller.get_selected_item()["id"] == this.props.item["id"]) {
            className = className + " SubjectCard_selected"
        }
        return className
    }

    render() {
        return <div className={this.get_class_name()}>
            {this.get_stats_block()}
            {this.get_control_block()}
        </div>
    }
}


class SubjectCardCreator extends React.Component {
    constructor() {
        super()
        this.state = {
            "name": "",
        }
    }

    get_stats_block = () => {
        return <div>
            <InputString
                label={locales.get("subject_name")}
                value={this.state.name}
                onChange={(value) => { this.setState({ "name": value }) }} />
        </div>
    }

    on_create = () => {
        subjects_controller.create_subject(this.state.name)
    }

    get_control_block = () => {
        return <div>
            <button onClick={this.on_create}>{locales.get("create")}</button>
        </div>

    }

    render() {
        return <div className="SubjectCard">
            {this.get_stats_block()}
            {this.get_control_block()}
        </div>
    }
}