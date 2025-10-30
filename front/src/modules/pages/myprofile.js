import React from "react";
import { InputString } from "../widgets/inputs";
import { locales } from "../../static/locales";
import { finfal_rc } from "../../static/backend_api";
import { auth_controller } from "../../static/controllers/auth_controller";
import { ErrorMessage } from "../widgets/error_popup";
import { modal_controller } from "../../static/controllers/modal_controller";
import { ActionWrapper } from "../widgets/action_wrapper";
export class MyProfilePage extends ActionWrapper {
    constructor() {
        super()
        this.state = {
            "old_password":"",
            "password": "",
            "dup_password": "",
        }
    }

    on_set_new_password = (value) =>{
        finfal_rc.post_new_password(this.state.old_password, this.state.password).catch((data)=>{
          this.onError(data["content"])
        })
    }

    on_password_validation = (value) => {
        if (this.state.dup_password !== this.state.password) {
            return false
        }
        else {
            return true
        }
    }

    get_warning_label = () => {
        if (this.on_password_validation()) {
            return <span></span>
        }
        return <label>passwords do not match</label>
    }

    render() {
        return <div>
            <div>
                <InputString label = "login" value={auth_controller.get_login()} disabled={true}></InputString>
                <InputString value={this.state.old_password} onChange={(value) => { this.setState({ "old_password": value }) }} label={locales.get("old_password")} />
                <InputString value={this.state.password} onChange={(value) => { this.setState({ "password": value }) }} label={locales.get("password")} />
                <InputString value={this.state.dup_password} onChange={(value) => { this.setState({ "dup_password": value }) }} label={locales.get("dup_password")} />
                {this.get_warning_label()}
                <button disabled={!this.on_password_validation()} onClick={this.on_set_new_password}>{locales.get("set_new_password")}</button>
            </div>
        </div>
    }
}