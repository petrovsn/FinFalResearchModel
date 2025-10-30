import React from "react";
import { finfal_rc } from "../../static/backend_api";
import '../../styles/lifestream.css'
export class LifestreamMatrix extends React.Component{
    constructor(){
        super()
        this.state = {
            "matrix":{}
        }
    }
    componentDidMount(){
        finfal_rc.master_get_lifestream_matrix().then(
            (data)=>{
                this.setState({"matrix":data})
            }
        )
    }

    get_L_matrix_row = (tissue_type) =>{
        let result = []
        result.push(<label>{tissue_type}</label>)
        let row_data = this.state.matrix[tissue_type]
        
        for(let i = row_data.length-1; i>=0; i--){
            let treshhold_data = row_data[i]
            result.push(<label>{treshhold_data["treshold"]}{"--->"}{treshhold_data["params"]["A"]};{treshhold_data["params"]["phi"]}{"--->"}</label>)
        }
        return <div className="LifestreamMatrix_row">{result}</div>
    }

    get_L_matrix = () =>{
        let result = []
        for(let tissue_type in this.state.matrix){
            result.push(this.get_L_matrix_row(tissue_type))
        }
        return result
    }

    render(){
        return <div className="LifestreamMatrix">
            {this.get_L_matrix()}
        </div>
    }
}