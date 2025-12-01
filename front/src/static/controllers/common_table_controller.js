import { store } from "../storage/storage"
import { createTableSlice } from "../storage/slices/tableSlice";
import { finfal_rc } from "../backend_api";
import { auth_controller } from "./auth_controller";
import { BaseBackendEntityController } from "../backend_api/base_controller";

export class CommonTableController {
    constructor(tableName) {
        this.tableName = tableName
        this.slice = createTableSlice(this.tableName);
        store.injectReducer(this.tableName, this.slice.reducer);
        this.actions = this.slice.actions;
        this.content_data = store.getState()[this.tableName]
        this.time_interval = store.getState().time
        this.unsubscribe = store.subscribe(() => {
            this.content_data = store.getState()[this.tableName]
            this.time_interval = store.getState().time
        })
        this.filters = {
            'offset': 0,
            'count': 10,
        }


        this.sorting = {
            'key': null,
            'desc': true
        }

        this.current_page = 0
        this.page_rowcount = 10

        this.backend_controller = new BaseBackendEntityController(tableName)
    }

    //=========Filters===================================================
    set_filters(params) {
        for (let key in params) {
            this.filters[key] = params[key]
        }
    }

    set_row_count = (value) => {
        this.page_rowcount = value
        this.update_paging_filters()
        this.update_content()
    }

    set_sorting_key = (key_value) => {
        if (this.sorting['key'] == key_value) {
            this.sorting['desc'] = !this.sorting['desc']
        }
        else {
            this.sorting['key'] = key_value
        }

        this.update_content()
    }

    get_sorting_key = () => {
        return this.sorting
    }

    //=========Filters===================================================
    set_filters(params) {
        for (let key in params) {
            this.filters[key] = params[key]
        }
    }

    get_time_intervals() {
        return {
            'not_before': new Date(this.time_interval.not_before).toISOString(),
            'not_after': new Date(this.time_interval.not_after).toISOString()
        }
    }

    update_content = () => {

        this.backend_controller.get(
            this.filters["offset"],
            this.filters["count"],
            this.sorting
        ).then((data) => {
            store.dispatch(this.actions.set_content(data))
            this.update_selected_item()
        })
    }

    delete = (obj_id) => {
        this.backend_controller.delete(obj_id)
            .then(data => {
                this.update_content()
            }
            )
    }

    get_filters() {
        return JSON.parse(JSON.stringify(this.filters))
    }

    update_paging_filters() {
        let actual_count = this.page_rowcount
        let actual_offset = this.current_page * this.page_rowcount
        this.set_filters(
            {
                'offset': actual_offset,
                'count': actual_count
            }
        )
    }

    //=========Paging====================================================
    set_row_count = (value) => {
        this.page_rowcount = value
        this.update_paging_filters()
        this.update_content()
    }

    on_next_page = () => {
        this.current_page = this.current_page + 1
        this.update_paging_filters()
        this.update_content()
    }

    on_prev_page = () => {
        this.current_page = Math.max(0, this.current_page - 1)
        this.update_paging_filters()
        this.update_content()
    }

    set_page_rowcount(row_count) {
        this.page_rowcount = row_count
        this.update_paging_filters()
        this.update_content()
    }

    get_current_page() {
        return this.current_page
    }

    get_keys = () => {
        return ["id"]
    }

    get_content() {
        let result = JSON.parse(JSON.stringify(this.content_data.content))
        return result
    }

    get_selected_item = () => {

        if (this.content_data.selected_item)
            if ("id" in this.content_data.selected_item) {
                console.log("get_selected_item", this.content_data.selected_item)
                return this.content_data.selected_item
            }

        return null
    }

    set_content = (content) => {
        store.dispatch(this.actions.set_content(content))
    }

    on_select = (item) => {
        console.log("get_selected_idxs", item)
        store.dispatch(this.actions.select_item(item))

    }

    get_selected_idx = () => {
        let selected_item = this.get_selected_item()
        if (selected_item) return selected_item["id"]
        return null
    }

    update_selected_item = () => {
        let selected_idx = this.get_selected_idx()
        if (selected_idx != null)
            for (let i in this.content_data.content) {
                if (this.content_data.content[i]["id"] == selected_idx) {
                    let actual_item = this.content_data.content[i]
                    store.dispatch(this.actions.select_item(actual_item))
                }
            }
    }

    get_selected_idxs = () => {
        let content_data = this.get_content()
        let selected_item = this.get_selected_item()
        console.log("get_selected_idxs", selected_item)
        let selected_idxs = []
        if (selected_item) {
            for (let i in content_data) {

                if (content_data[i]["id"] == selected_item["id"]) {
                    selected_idxs.push(i)
                }
            }
        }
        return selected_idxs
    }
}
