import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/master_page.css'
import { SubjectsWidget } from "./subjects_widget";
import { subjects_controller } from "../../static/controllers/subjects_controller";
import { InputString } from "./inputs";
import { UsersTable } from "./users_table";


export class EvolutionWidget extends React.Component {
    constructor() {
        super()
        this.state = {
            "nerves": {
                "0": {
                    "evo_stage_level": 0,
                    "max_mako_level": 17,
                    "min_stats_value": 1,
                    "max_stats_value": 5
                },
                "1": {
                    "evo_stage_level": 1,
                    "max_mako_level": 20,
                    "min_stats_value": 3,
                    "max_stats_value": 9
                },
                "2": {
                    "evo_stage_level": 2,
                    "max_mako_level": 16,
                    "min_stats_value": 7,
                    "max_stats_value": 13
                },
                "3": {
                    "evo_stage_level": 3,
                    "max_mako_level": 20,
                    "min_stats_value": 11,
                    "max_stats_value": 17
                }
            },
            "muscules": {
                "0": {
                    "evo_stage_level": 0,
                    "max_mako_level": 17,
                    "min_stats_value": 1,
                    "max_stats_value": 5
                },
                "1": {
                    "evo_stage_level": 1,
                    "max_mako_level": 20,
                    "min_stats_value": 3,
                    "max_stats_value": 9
                },
                "2": {
                    "evo_stage_level": 2,
                    "max_mako_level": 11,
                    "min_stats_value": 7,
                    "max_stats_value": 13
                },
                "3": {
                    "evo_stage_level": 3,
                    "max_mako_level": 15,
                    "min_stats_value": 11,
                    "max_stats_value": 17
                }
            },
            "blood": {
                "0": {
                    "evo_stage_level": 0,
                    "max_mako_level": 14,
                    "min_stats_value": 1,
                    "max_stats_value": 5
                },
                "1": {
                    "evo_stage_level": 1,
                    "max_mako_level": 14,
                    "min_stats_value": 3,
                    "max_stats_value": 9
                },
                "2": {
                    "evo_stage_level": 2,
                    "max_mako_level": 12,
                    "min_stats_value": 7,
                    "max_stats_value": 13
                },
                "3": {
                    "evo_stage_level": 3,
                    "max_mako_level": 18,
                    "min_stats_value": 11,
                    "max_stats_value": 17
                }
            }
        }
    }

    componentDidMount(){
        finfal_rc.get_evo_stages().then((data)=>{this.setState(data)}).catch()
    }

    get_tissue_evo_block = (tissue_type) => {
        let result = [<b>{tissue_type}</b>]
        for (let stage_idx in this.state[tissue_type]) {
            result.push(
                <div>
                    <label>{stage_idx}</label>
                    <InputString disabled = {true} label={"max_mako_level"} value={this.state[tissue_type][stage_idx]["max_mako_level"]} />
                    <InputString disabled = {true} label={"min_stats_value"} value={this.state[tissue_type][stage_idx]["min_stats_value"]} />
                    <InputString disabled = {true} label={"max_stats_value"} value={this.state[tissue_type][stage_idx]["max_stats_value"]} />
                </div>
            )
        }
        return <div className="tissue_evo_block"> {result} </div>
    }

    render() {
        let result = []
        for (let tissue_type in this.state) {
            result.push(this.get_tissue_evo_block(tissue_type))
        }
        return <div className="EvolutionWidget">
            {result}

        </div>
    }
}