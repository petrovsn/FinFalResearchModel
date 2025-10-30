import React from "react";
import { ReduxMemoryAccess } from "../widgets/memory_redux_access";
import { useSelector, useDispatch } from 'react-redux';
import { config_loader } from "../../static/config_loader";
import { finfal_rc } from "../../static/backend_api";
import { auth_controller } from "../../static/controllers/auth_controller";
import { InputString } from "../widgets/inputs";
import { locales } from "../../static/locales";
import '../../styles/Login.css'


export class LoginPage extends React.Component {
    constructor() {
        super()
        this.state = {
            "login": "string",
            "password": "string",
            "error_message": "",
            "initiated": true
        }
    }

    componentDidMount() {
        let interval_id = setInterval(this.check_status, 1000)
        this.setState({"update_interval":interval_id})
    }

    check_status = () => {
        finfal_rc.get_server_status()
            .then((status) => { this.setState(status) })
            .catch((data) => {  this.setState({ "error_message": "server_not_available" }) })
    }
    componentWillUnmount() {
        clearInterval(this.state.update_interval)
    }
    onLogin = () => {
        auth_controller.auth(this.state.login, this.state.password, this.onLoginSuccess, this.onLoginFailure)
    }

    onInitiate = () => {
        finfal_rc.post_initiate_server(this.state.login, this.state.password).catch(() => {
            this.setState({ "error_message": "server_not_available" })
        })
    }

    onLoginSuccess = () => {
        this.setState({ "error_message": "" })
    }

    onLoginFailure = () => {
        this.setState({ "error_message": "wrong password or login" })
    }

    on_password_validation = (value) => {
        return true
    }

    get_warning_label = () => {
        if (this.state.error_message != "") {
            return <label>{locales.get(this.state.error_message)}</label>
        }
        return <span></span>
    }

    get_login_page = () => {
        return <div className="LoginPage">
            <InputString value={this.state.login} onChange={(value) => { this.setState({ "login": value }) }} label={locales.get("login")} />
            <InputString value={this.state.password} onChange={(value) => { this.setState({ "password": value }) }} label={locales.get("password")} />
            {this.get_warning_label()}
            {this.state.initiated ?
                <button onClick={this.onLogin}>{locales.get("do_login")}</button> :
                <button onClick={this.onInitiate}>{locales.get("do_initate")}</button>}
        </div>
    }

    render() {
        return this.get_login_page()
    }
}