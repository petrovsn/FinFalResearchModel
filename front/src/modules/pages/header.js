import React from "react";
import '../../styles/MainPage.css'
import { logout } from "../../static/storage/slices/authSlice";
import { store } from "../../static/storage/storage";
import { StatusViewer } from "../widgets/status_viewer";
import { locales } from "../../static/locales";
import { auth_controller } from "../../static/controllers/auth_controller";
import '../../styles/header.css'

export class Header extends React.Component {
    on_logout = () => {
        store.dispatch(logout())
    }
    render() {
        return <div className="Header">
            <img src='imgs/logo_rus.jpg' />
            <div className="DataBlock">
                <label className="CA_name_label">{locales.get("CA_product_name")}</label>
                <div className="UserData">

                    <label>{locales.get("current_user")}: {auth_controller.get_login()} [{auth_controller.get_role()}]</label>
                    <button onClick={this.on_logout}>{locales.get("logout")}</button>
                </div>
                <StatusViewer />
            </div>
        </div>
    }
}