import React from "react";


class SubjectStoryTable extends React.Component{
    constructor(){
        super()
    }
    activate_event

    get_control_panel = () =>{
        return <div>
            <button></button>
        </div>
    }

    render(){
        return <div>
            {this.get_control_panel()}
            <CustomTableWidget table_controller = {subjects_story_controller}/>
        </div>
    }
}