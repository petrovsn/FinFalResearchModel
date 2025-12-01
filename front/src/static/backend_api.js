import { http_request, http_auth_request } from "./http_request"
import { config_loader } from "./config_loader"

export class FinFalResearchCenter {
    constructor() {
        this.token = ""
    }

    set_token = (token) => {
        this.token = token
    }

    async auth(login, password) {
        let url = config_loader.get_server_url()
        let data = await http_auth_request(url + "/users/login", login, password)
        return data
    }

    async get_server_status() {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let data = await http_request(url + "/utils/status", "GET", header, {})
        return data
    }

    async post_initiate_server(login, password) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "login": login,
            "password": password
        }
        let data = await http_request(url + "/admin/initiate", "POST", header, body)
        return data
    }

    //======================================PROFILES==================================================================
    async get_subjects(offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        if (sorting_key["key"]) {
            header["sorting-key"] = sorting_key["key"]
            header["sorting-desc"] = sorting_key["desc"]
        }


        let data = await http_request(url + "/subjects", "GET", header, {})
        return data
    }

    async get_subject_info(subject_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let data = await http_request(url + `/subjects/${subject_id}/info`, "GET", header, {})
        return data
    }


    async get_available_subjects(offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        if (sorting_key["key"]) {
            header["sorting-key"] = sorting_key["key"]
            header["sorting-desc"] = sorting_key["desc"]
        }

        let data = await http_request(url + "/subjects/available", "GET", header, {})
        return data
    }

    async create_subject(name) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "name": name,
        }

        let data = await http_request(url + "/subjects", "POST", header, body)
        return data
    }

    async create_user(login, name, password, role) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "login": login,
            "name": name,
            "password": password,
            "role": role,
        }

        let data = await http_request(url + "/users", "POST", header, body)
        return data
    }

    async master_get_lifestream_matrix() {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let data = await http_request(url + "/lifestream/params", "GET", header, {})
        return data
    }

    async put_subject_status(subject_id, subject_status) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = subject_status

        let data = await http_request(url + "/subjects/" + subject_id + '/status', "PUT", header, body)
        return data
    }

    async delete_subject(subject_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = {
        }

        let data = await http_request(url + `/subjects/${subject_id}/status`, "DELETE", header, body)
        return data
    }

    async apply_jenova_injection(subject_id, jenova_injection) {
        if (!subject_id) return
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = {
            "subject_id": subject_id,

            "jenova_cells": jenova_injection["jenova_cells"]
        }

        let data = await http_request(url + "/bio/inject_jenova", "POST", header, body)
        return data
    }

    async apply_mako_injection(subject_id, mako_injection) {
        if (!subject_id) return
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = {
            "subject_id": subject_id,
            "mako_injection": {
                "blood": mako_injection["blood"],
                "nerves": mako_injection["nerves"],
                "muscules": mako_injection["muscules"],
            }
        }

        let data = await http_request(url + "/bio/inject_mako", "POST", header, body)
        return data
    }

    async apply_drugs_injection(subject_id, drug_injection) {
        if (!subject_id) return
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = {
            "subject_id": subject_id,
            "drug_injection": drug_injection
        }


        let data = await http_request(url + "/bio/inject_drugs", "POST", header, body)
        return data
    }

    async next_phase() {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let data = await http_request(url + `/bio/next_phase`, "GET", header, {})
        return data
    }


    async get_scilogs(offset, count) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + `/bio/scilog`, "GET", header, {})
        return data
    }

    async get_tasks(filters, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (filters != null) header["filtres"] = JSON.stringify(filters)
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        if (sorting_key["key"]) {
            header["sorting-key"] = sorting_key["key"]
            header["sorting-desc"] = sorting_key["desc"]
        }

        let data = await http_request(url + `/tasks`, "GET", header, {})
        return data
    }

    async set_task_status(task_id, task_status) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = {
            "task_status": task_status
        }

        let data = await http_request(url + `/tasks/${task_id}`, "PUT", header, body)
        return data
    }

    async get_evo_stages() {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let data = await http_request(url + `/bio/evolution`, "GET", header, {})
        return data
    }

    async get_actual_task(subject_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {

        }

        let data = await http_request(url + `/subjects/${subject_id}/actual_task`, "GET", header, body)
        return data
    }

    async post_comply_task(subject_id, input_numbers) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "subject_id": subject_id,
            "input_numbers": input_numbers
        }

        let data = await http_request(url + `/tasks/comply`, "POST", header, body)
        return data
    }


    async get_users(filters, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (filters != null) header['filters'] = JSON.stringify(filters)
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        if (sorting_key)
            if (sorting_key["key"]) {
                header["sorting-key"] = sorting_key["key"]
                header["sorting-desc"] = sorting_key["desc"]
            }

        let data = await http_request(url + "/users", "GET", header, {})
        return data
    }




    async update_user(user_login, user_data) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = Object.assign({}, user_data)

        let data = await http_request(url + `/users/${user_login}`, "PUT", header, body)
    }


    async import_users_csv(csv_users) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "csv_data": csv_users,
        }

        let data = await http_request(url + `/users/import`, "POST", header, body)
        return data
    }




    async get_logs(not_before, not_after, user, action, result, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (not_before != null) header['not-before'] = not_before
        if (not_after != null) header['not-after'] = not_after
        if (user != null) header['user'] = user
        if (action != null) header['action'] = action
        if (result != null) header['result'] = result
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + `/admin/logs`, "GET", header, {})
        return data
    }

    async get_assignments(offset, count) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + "/assignments", "GET", header, {})
        return data
    }

    async put_assignment(subject_name, doctor_name) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}
        if (subject_name != null) body['subject_name'] = subject_name
        if (doctor_name != null) body['doctor_name'] = doctor_name

        let data = await http_request(url + "/assignments", "PUT", header, body)
        return data
    }

    async get_subject_stats_history(subject_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}

        let data = await http_request(url + `/subjects/${subject_id}/stats_history`, "GET", header, body)
        return data
    }

    async get_services_state() {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}

        let data = await http_request(url + `/utils/services`, "GET", header, body)
        return data
    }

    async set_service_timeout(service_name, timeout) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = timeout.toString()

        let data = await http_request(url + `/utils/services/${service_name}/timeout`, "PUT", header, body)
        return data
    }

    async set_service_state(service_name, is_alive) {
        console.log("service_name", service_name, is_alive)
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = is_alive.toString()

        let data = await http_request(url + `/utils/services/${service_name}/is_alive`, "PUT", header, body)
        return data
    }

    async get_mutatation_processes(offset, count) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        let body = {}

        let data = await http_request(url + `/mut_process`, "GET", header, body)
        return data
    }

    async get_actual_mutation_process(subject_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}

        let data = await http_request(url + `/subjects/${subject_id}/actual_mutation_process`, "GET", header, body)
        return data
    }

    async get_mutation_process_remaining_seconds(mutation_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}

        let data = await http_request(url + `/mut_process/${mutation_id}/seconds_remain`, "GET", header, body)
        return data
    }

    async run_mutation_supression(mutation_id) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {}

        let data = await http_request(url + `/mut_process/${mutation_id}/run_supression`, "PUT", header, body)
        return data
    }

    async supress_mutation(mutation_id, success_points, confirmation_code) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "success_points": success_points,
            "confirmation_code": confirmation_code
        }

        let data = await http_request(url + `/mut_process/${mutation_id}/supression_result`, "PUT", header, body)
        return data
    }


    async get_mutations(offset, count) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count
        let body = {}

        let data = await http_request(url + `/mutations`, "GET", header, body)
        return data
    }

    async post_mutation(name, mutation_class, description, conditions){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "name": name,
            "mutation_class": mutation_class,
            "description":description,
            "conditions":[]
        }

        let data = await http_request(url + `/mutations`, "POST", header, body)
        return data
    }


    async import_mutations_csv(csv_users) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "csv_data": csv_users,
        }

        let data = await http_request(url + `/mutations/import`, "POST", header, body)
        return data
    }


    async get_events(not_before, not_after, user, action, result, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (not_before != null) header['not-before'] = not_before
        if (not_after != null) header['not-after'] = not_after
        if (user != null) header['user'] = user
        if (action != null) header['action'] = action
        if (result != null) header['result'] = result
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + `/events`, "GET", header, {})
        return data
    }

     async get_events_tracking(not_before, not_after, user, action, result, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (not_before != null) header['not-before'] = not_before
        if (not_after != null) header['not-after'] = not_after
        if (user != null) header['user'] = user
        if (action != null) header['action'] = action
        if (result != null) header['result'] = result
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + `/events/export`, "GET", header, {})
        return data
    }


    async post_event(event_type, multiple, name, description){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "event_type": event_type,
            "multiple": multiple,
            "name": name,
            "description": description
        }

        let data = await http_request(url + `/events`, "POST", header, body)
        return data
    }

    async put_activate_event(event_id, subject_id){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "event_id": event_id,
            "subject_id": subject_id,
        }

        let data = await http_request(url + `/events`, "PUT", header, body)
        return data
    }

    async import_events_csv(csv_users) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "csv_data": csv_users,
        }

        let data = await http_request(url + `/events/import`, "POST", header, body)
        return data
    }

    async get_stims(not_before, not_after, user, action, result, offset, count, sorting_key) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        if (not_before != null) header['not-before'] = not_before
        if (not_after != null) header['not-after'] = not_after
        if (user != null) header['user'] = user
        if (action != null) header['action'] = action
        if (result != null) header['result'] = result
        if (offset != null) header['offset'] = offset
        if (count != null) header['count'] = count

        let data = await http_request(url + `/stims`, "GET", header, {})
        return data
    }

    async post_stim(tissue_type, mako_volume){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "tissue_type": tissue_type,
            "mako_volume": mako_volume,
        }

        let data = await http_request(url + `/stims`, "POST", header, body)
        return data
    }

    async import_stims_csv(csv_users) {
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }
        let body = {
            "csv_data": csv_users,
        }

        let data = await http_request(url + `/stims/import`, "POST", header, body)
        return data
    }

    async get_config(){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let data = await http_request(url + `/utils/config`, "GET", header, {})
        return data
    }

    async post_config(new_config){
        let url = config_loader.get_server_url()
        let header = {
            'Authorization': `Bearer ${this.token}`,
        }

        let body = JSON.stringify(new_config)

        let data = await http_request(url + `/utils/config`, "POST", header, body)
        return data
    }
}




export const finfal_rc = new FinFalResearchCenter()