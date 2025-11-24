import { store } from "../storage/storage"
import { finfal_rc } from "../backend_api";
import { registerTable } from "../storage/storage";
import { createTableSlice } from "../storage/slices/tableSlice";
import { addTableReducer } from "../storage/storage";
import { CommonTableController } from "./common_table_controller";

class StimsTableController extends CommonTableController{
    constructor(){
        super("Stims")
        this.set_filters({
            "type":null,
        })
    }

    get_keys = () =>{
        return ["id", "code", "tissue_type", "mako_volume"]
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
        finfal_rc.get_stims(
            null,
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
          })
    }
}

export const stims_table_controller = new StimsTableController()



