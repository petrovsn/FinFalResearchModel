import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { auth_controller } from "../../static/controllers/auth_controller";
import { InputString, InputInt, InputSelector } from "./inputs";
import { CustomTable, CustomTablePagingButtons, CustomTableWidget } from "./table";
import { locales } from "../../static/locales";
import { AssignChanger } from "./assignments_table";
import { modal_controller } from "../../static/controllers/modal_controller";
import { scilog_table_controller } from "../../static/controllers/log_controller";
import { ActionWrapper } from "./abstract/action_wrapper";
export class SubjectsTable extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        subjects_controller.update_content()
    }

    on_change_assignment = () => {
        modal_controller.show(<AssignChanger item={subjects_controller.get_selected_item()} />)
    }

    on_inject_drugs = () => {
        modal_controller.show(<DrugInjectionWidget item={subjects_controller.get_selected_item()} />)
    }

    on_inject_mako = () => {
        modal_controller.show(<MakoInjectionWidget item={subjects_controller.get_selected_item()} />)
    }


    on_change_status = () => {
        modal_controller.show(<SetSubjectStatusWidget item={subjects_controller.get_selected_item()} />)
    }


    on_modify_subject = () => {
        modal_controller.show(<SetSubjectStatusWidget item={subjects_controller.get_selected_item()} />)
    }

    on_inject_jenova = () => {
        modal_controller.show(<JenovaInjectionWidget item={subjects_controller.get_selected_item()} />)
    }

    on_complete_task = () => {
        modal_controller.show(<MakoTaskPerformanceWidget item={subjects_controller.get_selected_item()} />)
    }

    on_proceed_mutation = () => {
        modal_controller.show(<MutationProceederViewer item={subjects_controller.get_selected_item()} />)
    }

    on_view_subject = () => {
        modal_controller.show(<MasterSubjectViewer item={subjects_controller.get_selected_item()} />)
    }

    on_get_stat_history = () => {
        modal_controller.show(<SubjectHistoryViewer item={subjects_controller.get_selected_item()} />)
    }

    get_actions_button = () => {
        let buttons_block = [
            <button onClick={subjects_controller.update_content}>{locales.get("update")}</button>,
        ]
        if (subjects_controller.get_selected_item()) {
            if (this.props.mode == "senior") {
                buttons_block.push(<button onClick={this.on_change_assignment}>{locales.get("assign_doctor")}</button>)
                buttons_block.push(<button onClick={this.on_get_stat_history}>{locales.get("get_stats_history")}</button>)
            }
            else if (this.props.mode == "doctor") {
                buttons_block.push(<button onClick={this.on_inject_drugs}>{locales.get("inject_drugs")}</button>)
                buttons_block.push(<button onClick={this.on_inject_mako}>{locales.get("inject_mako")}</button>)
                buttons_block.push(<button onClick={this.on_complete_task}>{locales.get("complete_task")}</button>)
                buttons_block.push(<button onClick={this.on_proceed_mutation}>{locales.get("proceed_mutation")}</button>)
                buttons_block.push(<button onClick={this.on_get_stat_history}>{locales.get("get_stats_history")}</button>)
            }
            else if (this.props.mode == "master") {
                buttons_block.push(<button onClick={this.on_view_subject}>{locales.get("view_subject")}</button>)
                buttons_block.push(<button onClick={this.on_change_status}>{locales.get("set_subject_status")}</button>)
                buttons_block.push(<button onClick={this.on_inject_drugs}>{locales.get("inject_drugs")}</button>)
                buttons_block.push(<button onClick={this.on_inject_mako}>{locales.get("inject_mako")}</button>)
                buttons_block.push(<button onClick={this.on_complete_task}>{locales.get("complete_task")}</button>)
                buttons_block.push(<button onClick={this.on_inject_jenova}>{locales.get("inject_jenova")}</button>)
                buttons_block.push(<button onClick={this.on_get_stat_history}>{locales.get("get_stats_history")}</button>)
                buttons_block.push(<button onClick={this.on_change_assignment}>{locales.get("assign_doctor")}</button>)
            }

        }
        return <div className="table_actions_block">
            {buttons_block}
        </div>
    }

    render() {
        return <div className="UsersTable">
            {this.props.mode == "master" ? <h4>{locales.get("SubjectTable")}</h4> : null}
            {this.get_actions_button()}
            <CustomTableWidget table_controller={subjects_controller}></CustomTableWidget>
        </div>
    }
}


export class DrugInjectionWidget extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "drugs": 0,
        }
    }

    on_inject = () => {
        let selected_subject = subjects_controller.get_selected_item()
        if (!selected_subject) return
        finfal_rc.apply_drugs_injection(selected_subject["id"], this.state.drugs).then(
            (data) => {
                subjects_controller.update_content()
                scilog_table_controller.update_content()
            }
        )
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.on_inject}>{locales.get("inject")}</button>
        </div>
    }


    get_action = () => {
        return <InputInt label="drug_amont" onChange={(v) => { this.setState({ "drugs": v }) }} />
    }

    render() {
        return <div className="MakoInjectionWidget">
            <SubjectViewer item={this.props.item} />
            {this.get_action()}
            {this.get_controls()}
        </div>

    }

}


export class JenovaInjectionWidget extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "jenova_cells": 0,
        }
    }

    on_inject = () => {
        let selected_subject = subjects_controller.get_selected_item()
        if (!selected_subject) return
        finfal_rc.apply_jenova_injection(selected_subject["id"], this.state).then(
            (data) => {
                console.log("apply_mako_injection", data)
                subjects_controller.update_content()
                scilog_table_controller.update_content()
                modal_controller.hide()
            }
        ).catch((data) => {
            this.onError(data["content"])
        })
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.on_inject}>{locales.get("inject")}</button>
        </div>
    }


    get_action = () => {
        let result = []
        for (let k in this.state) {
            result.push(
                <InputInt label={k} value={this.state[k]}
                    onChange={(value) => { this.setState({ [k]: value }) }}
                ></InputInt>
            )
        }
        return result
    }

    render() {
        return <div className="MakoInjectionWidget">
            <SubjectViewer item={this.props.item} />
            {this.get_action()}
            {this.get_controls()}
        </div>

    }

}

export class MakoInjectionWidget extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "nerves": 0,
            "muscules": 0,
            "blood": 0,
        }
    }

    on_inject = () => {
        let selected_subject = subjects_controller.get_selected_item()
        if (!selected_subject) return
        finfal_rc.apply_mako_injection(selected_subject["id"], this.state).then(
            (data) => {
                console.log("apply_mako_injection", data)
                subjects_controller.update_content()
                scilog_table_controller.update_content()
                modal_controller.show(<MakoTaskPerformanceWidget item={this.props.item} />)
            }
        ).catch((data) => {
            this.onError(data["content"])
        })
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.on_inject}>{locales.get("inject")}</button>
        </div>
    }


    get_action = () => {
        let result = []
        for (let k in this.state) {
            result.push(
                <InputInt label={k} value={this.state[k]}
                    onChange={(value) => { this.setState({ [k]: value }) }}
                ></InputInt>
            )
        }
        return result
    }

    get_warning_label = () => {
        if (this.state.blood + this.state.nerves + this.state.muscules >= this.props.item.cell_stability) {
            return <label className="warning_label">{locales.get("too_much_mako_warning")}</label>
        }
        return null
    }

    render() {
        return <div className="MakoInjectionWidget">
            <SubjectViewer item={this.props.item} />
            {this.get_action()}
            {this.get_warning_label()}
            {this.get_controls()}
        </div>

    }

}


class MakoTaskPerformanceWidget extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            task_numbers: [],
            input_numbers: [],
            current_num: 0
        }
    }

    componentDidMount() {
        console.log("MakoTaskPerformanceWidget", this.props.item)
        finfal_rc.get_actual_task(this.props.item.id)
            .then(data => {
                console.log("MakoTaskPerformanceWidget", data)
                this.setState({ "task_numbers": data["task_numbers"] })
            })
    }

    add_to_vector = () => {
        if (this.state.current_num) {
            let tmp = this.state.input_numbers
            tmp.push(this.state.current_num)
            this.setState({ "input_numbers": tmp })
        }

    }

    on_inject = () => {
        finfal_rc.post_comply_task(this.props.item.id, this.state.input_numbers)
            .then((data) => {
                subjects_controller.update_content()
                scilog_table_controller.update_content()
                modal_controller.show(<MakoInjectionResult data={data} />)
            })
            .catch(data => { this.onError(data) })
    }

    get_action = () => {
        let nums = this.props.numbers ? this.props.numbers.toString() : ""
        return <div>
            <InputString label="input_numbers" disabled={true} value={this.state.input_numbers.toString()} />
            <div><InputInt label="input_next_number"
                onChange={(v) => { this.setState({ "current_num": v }) }}
                value={this.state.current_num} /> <button onClick={this.add_to_vector}>{locales.get("add_number")}</button></div>
        </div>
    }
    get_controls = () => {
        return <div>
            <button onClick={this.on_inject}>{locales.get("inject")}</button>
        </div>
    }

    render() {
        return <div className="MakoInjectionWidget">

            {this.get_action()}
            {this.get_controls()}
        </div>

    }
}

class SubjectViewer extends React.Component {
    render() {
        return <div>
            <InputString disabled={true}
                label={locales.get("subject_name")}
                value={this.props.item["name"]} />

            <InputString disabled={true}
                label={locales.get("status")}
                value={this.props.item["status"]} />

            <InputString disabled={true}
                label={locales.get("mental_stability")}
                value={this.props.item["mental_stability"]} />

            <InputString disabled={true}
                label={locales.get("cell_stability")}
                value={this.props.item["cell_stability"]} />
            <InputString disabled={true}
                label={locales.get("stats_health")}
                value={this.props.item["stats_health"]} />
            <InputString disabled={true}
                label={locales.get("stats_reaction")}
                value={this.props.item["stats_reaction"]} />
            <InputString disabled={true}
                label={locales.get("stats_strength")}
                value={this.props.item["stats_strength"]} />
            <InputString disabled={true}
                label={locales.get("mutations")}
                value={this.props.item["mutations"]} />
        </div>
    }
}

export class SetSubjectStatusWidget extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "status": null,
        }
    }

    on_action = () => {
        let selected_subject = subjects_controller.get_selected_item()
        if (!selected_subject) return
        finfal_rc.put_subject_status(selected_subject["id"], this.state.status).then(
            (data) => {
                subjects_controller.update_content()
                scilog_table_controller.update_content()
                modal_controller.hide()
            }
        )
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.on_action}>{locales.get("set_status")}</button>
        </div>
    }


    get_action = () => {
        return <InputSelector label="new_subject_status"
            onChange={(v) => { this.setState({ "status": v }) }}
            options={
                ["ready", "injected", "on_rest"]
            } />
    }

    render() {
        return <div className="MakoInjectionWidget">
            <SubjectViewer item={this.props.item} />
            {this.get_action()}
            {this.get_controls()}
        </div>

    }

}


class MasterSubjectViewer extends React.Component {
    constructor() {
        super()
        this.state = {
            "id": null,
            "name": null,
            "status": null,
            "status_change_timestep": null,
            "mental_stability": null,
            "cell_stability": null,
            "jenova_cells": null,
            "tissues": {
                "nerves": {
                    "tissue_type": "nerves",
                    "current_evo_stage": null,
                    "current_mako_level": null
                },
                "muscules": {
                    "tissue_type": "muscules",
                    "current_evo_stage": null,
                    "current_mako_level": null
                },
                "blood": {
                    "tissue_type": "blood",
                    "current_evo_stage": null,
                    "current_mako_level": null
                }
            },
            "mutations": "",
            "next_mutation": "",
            "potential_mutations": []
        }
    }

    get_tissue_block_info = (tissue_name) => {
        return <div>
            <i>{tissue_name}</i>
            <InputString disabled={true}
                label={locales.get("current_evo_stage")}
                value={this.state["tissues"][tissue_name]["current_evo_stage"]} />

            <InputString disabled={true}
                label={locales.get("current_mako_level")}
                value={this.state["tissues"][tissue_name]["current_mako_level"]} />
        </div>
    }

    componentDidMount() {
        this.get_subject_data()
    }

    get_subject_data = () => {
        finfal_rc.get_subject_info(this.props.item["id"])
            .then(data => { this.setState(data) })
            .catch()
        finfal_rc.get_potential_mutations(this.props.item["id"])
            .then(data => this.setState({ "potential_mutations": data }))
            .catch()
    }

    assign_next_mutation = (value) => {
        finfal_rc.put_assign_next_mutation(this.state.id, value)
            .then(
                data => {
                    this.get_subject_data()
                }
            ).catch()
    }

    get_potential_mutations = () => {
        let result = []
        for (let i in this.state.potential_mutations) {
            let mut = this.state.potential_mutations[i]
            result.push(<label>{locales.get(mut[0])}: {mut[1]}
                <button
                    onClick={e => this.assign_next_mutation(mut[0])}
                >assign_next</button></label>)
        }
        return <div className="potential_mutations">
            {result}
        </div>
    }

    get_body = () => {
        return <div className="MasterSubjectViewer">
            <InputString disabled={true}
                label={locales.get("subject_name")}
                value={this.state["name"]} />

            <InputString disabled={true}
                label={locales.get("status")}
                value={this.state["status"]} />

            <InputString disabled={true}
                label={locales.get("mental_stability")}
                value={this.state["mental_stability"]} />

            <InputString disabled={true}
                label={locales.get("cell_stability")}
                value={this.state["cell_stability"]} />
            {this.get_tissue_block_info("muscules")}
            {this.get_tissue_block_info("nerves")}
            {this.get_tissue_block_info("blood")}
            <InputString disabled={true}
                label={locales.get("mutations")}
                value={this.state["mutations"]} />
            <InputString disabled={true}
                label={locales.get("next_mutation")}
                value={this.state["next_mutation"]} />

            {this.get_potential_mutations()}
        </div>
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
        </div>
    }

    render() {
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>


    }
}


class SubjectHistoryViewer extends React.Component {
    constructor() {
        super()
        this.state = {
            content: [],
        }
    }

    componentDidMount() {
        finfal_rc.get_subject_stats_history(this.props.item.id)
            .then(data => { this.setState({ "content": data }) })
            .catch()
    }

    get_body = () => {
        return <div className="SubjectHistoryViewer_table_roller">
            <CustomTable
                content={this.state.content}
                keys={["created_at", "cell_stability", "mental_stability",
                    "stats_health", "stats_reaction", "stats_strength", "jenova_cells"
                ]} />
        </div>
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
        </div>
    }

    render() {
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>
    }
}


/*result = {
            "energy_assimilated":evo_energy.get_summary_mako_level(),
            "cell_unstability":cell_unstability,
            "warning_low_cell_stability": False,
            "warning_low_mental_stability": False
        }*/

class MakoInjectionResult extends React.Component {

    get_body = () => {
        let result = [
            <InputString disabled={true} label="energy_assimilated" value={this.props.data.energy_assimilated} />,
            <InputString disabled={true} label="cell_unstability" value={this.props.data.cell_unstability} />
        ]

        if (this.props.data.warning_low_cell_stability) {
            result.push(
                <InputString disabled={true} label="warning" value={"warning_low_cell_stability"} />
            )
        }

        if (this.props.data.warning_low_mental_stability) {
            result.push(
                <InputString disabled={true} label="warning" value={"warning_low_mental_stability"} />
            )
        }


        return <div>
            {result}
        </div>
    }

    get_controls = () => {
        return <div className="control_panel">
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
        </div>
    }

    render() {
        console.log("MakoInjectionResult", this.props.data)
        return <div>
            {this.get_body()}
            <p></p>
            {this.get_controls()}
        </div>

    }
}

class MutationProceederViewer extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            timer: null,
            seconds_remain: null,
            supression_points: 0,
            confirmation_code: ""
        }
    }

    componentDidMount() {
        finfal_rc.get_actual_mutation_process(this.props.item.id).then(
            data => {

                finfal_rc.run_mutation_supression(data["id"])
                let timer_id = setInterval(this.update_timer, 1000)
                data["timer"] = timer_id
                this.setState(data)
            }
        )
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer)
    }

    update_timer = () => {
        finfal_rc.get_mutation_process_remaining_seconds(this.state.id)
            .then(seconds_remain => { this.setState({ "seconds_remain": seconds_remain }) })
            .catch()
    }

    on_supress_mutation = () => {
        finfal_rc.supress_mutation(this.state.id, this.state.supression_points, this.state.confirmation_code)
            .then(data => {

                modal_controller.show(<MutationProceederResult result={data} />)

            })
            .catch(data => {
                console.log("on_supress_mutation", data)
                this.onError(data.content)
            })
    }

    get_body = () => {
        return <div>
            <InputString disabled={true} value={this.state.mutation_class} label={locales.get("mutation_class")} />
            <InputString disabled={true} value={this.state.complexity} label={locales.get("mutation_complexity")} />
            <InputString disabled={true} value={this.state.seconds_remain} label={locales.get("seconds_remain")} />
            <InputInt
                onChange={v => { this.setState({ "supression_points": v }) }}
                value={this.state.supression_points} label={locales.get("supression_points")} />
            <InputString
                onChange={v => { this.setState({ "confirmation_code": v }) }}
                value={this.state.confirmation_code} label={locales.get("confirmation_code")} />
        </div>
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
            <button onClick={this.on_supress_mutation}>{locales.get("supress_mutation")}</button>
        </div>
    }

    render() {
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>
    }
}

class MutationProceederResult extends ActionWrapper {
    get_body = () => {
        return <div>
            <label>{locales.get(this.props.result.mutation)}</label>
            {this.props.result.result ?
                <label>{locales.get("supressed")}</label>
                : <label>{locales.get("evolved")}</label>}

        </div>
    }

    get_controls = () => {
        return <div>
            <button onClick={modal_controller.hide}>{locales.get("close")}</button>
        </div>
    }

    render() {
        return <div>
            {this.get_body()}
            {this.get_controls()}
        </div>
    }
}