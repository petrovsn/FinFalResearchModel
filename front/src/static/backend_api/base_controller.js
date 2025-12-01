import { http_request } from "../http_request"
import { store } from "../storage/storage"
import { config_loader } from "../config_loader"
export class BaseBackendEntityController {
    constructor(prefix) {
        this.prefix = "/"+prefix
    }

    get_token = () => {
        console.log("BaseTable", store.getState())
        return store.getState()["auth"].token
    }

    async get(offset, count, sorting_key) {

        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.get_token()}`,
        }

        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        if (sorting_key["key"]) {
            header["sorting-key"] = sorting_key["key"]
            header["sorting-desc"] = sorting_key["desc"]
        }

        let data = await http_request(url + this.prefix, "GET", header, {})
        return data
    }

    post = () => {

    }

    put = () => {

    }

    async delete(id){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.get_token()}`,
        }
        let body = {}

        let data = await http_request(url + this.prefix + `/${id}`, "DELETE", header, body)
        return data
    }

    async import(csv_data) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.get_token()}`,
        }
        let body = {
            "csv_data": csv_data,
        }

        let data = await http_request(url + this.prefix + `/import`, "POST", header, body)
        return data
    }
}