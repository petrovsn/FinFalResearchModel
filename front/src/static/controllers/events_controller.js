import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class EventsTableController extends CommonTableController{
    constructor(){
        super("events")
        this.set_filters({
            "type":null,
        })
    }
    get_keys = () =>{
        return ["id", "code", "event_type", "name", "description", "multiple", "used", "subjects"]
    }

    get_content() {
        let result = JSON.parse(JSON.stringify(this.content_data.content))
        for(let i in result){
            let tmp = ""
            for(let k in result[i]["subjects"]){
                tmp = tmp+k+" "
            }
            result[i]["subjects"] = tmp
            result[i]["used"] = result[i]["used"].toString()
        }
        return result
    }

    update_content = () =>{
        finfal_rc.get_events(
            null,
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            for(let i in data){
                data[i]["multiple"] = data[i]["multiple"]?"True":"False"
            }
            store.dispatch(this.actions.set_content(data))
          })
    }
}

export const events_table_controller = new EventsTableController()



class EventsTrackerTableController extends CommonTableController{
    constructor(){
        super("events")
        this.set_filters({
            "type":null,
        })
    }
    get_keys = () =>{
        return ["events"]
    }


    update_content = () =>{
        finfal_rc.get_events_tracking(
            null,
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            for(let i in data){
                data[i]["multiple"] = data[i]["multiple"]?"True":"False"
            }
            store.dispatch(this.actions.set_content(data))
          })
    }
}


export const events_tracker_table_controller = new EventsTrackerTableController()