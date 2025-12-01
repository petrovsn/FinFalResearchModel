import React from "react";
import '../../styles/MainPage.css'
import { locales } from "../../static/locales";
import { navigation_controller } from "../../static/controllers/navigation_controller";

import { SeniorPage } from "./senior/senior_page";

import {auth_controller} from '../../static/controllers/auth_controller'
import { MasterPage_Admin } from "./master/master_admin";
import { DoctorPage } from "./doctor/doctor_page";
import { MasterPage_Evo } from "./master/master_evo";
import { MasterPage_Mutations } from "./master/master_bio";
import { MasterPage_System } from "./master/master_system";
import { MasterPage_Story } from "./master/master_story";
class Navigation extends React.Component{
    componentDidMount(){
        let role = auth_controller.get_role()
        let tabs_list = navigation_controller.get_tabs_list(role)
        navigation_controller.set_tab_active(tabs_list[0])

    }
    get_tabs_list = () =>{
        let role = auth_controller.get_role()
        let tabs_list = navigation_controller.get_tabs_list(role)
        let tabs_list_obj = []
        for (let i in tabs_list){
            let tab_name = tabs_list[i]
            let class_name = ""
            if (navigation_controller.is_tab_active(tab_name)){
                class_name = "tab_active"
            }
            tabs_list_obj.push(<li 
                className={class_name} 
                onClick={(e)=>{navigation_controller.set_tab_active(tab_name)}}>
                    {locales.get(tab_name)}</li>)
        }
        return tabs_list_obj

    }
    render() { 
        return <div className="Navigation">
            {this.get_tabs_list()}
        </div>
        
    }
}

class ContentZone extends React.Component {
    get_active_content = ()=>{
        switch (navigation_controller.get_current_active_tab()){
            case 'master_admin':{
                return <MasterPage_Admin/>
            }

            case 'master_evo':{
                return <MasterPage_Evo/>
            }

            case 'master_mutations':{
                return <MasterPage_Mutations/>
            }

            case 'master_system':{
                return <MasterPage_System/>
            }

            case 'master_story':{
                return <MasterPage_Story/>
            }

            case 'senior_page':{
                return <SeniorPage/>
            }

            case "doctor_page": {
                return <DoctorPage />
            }
        }
    }
    render() { 
        return <div className="ContentZone">{this.get_active_content()}</div>
    }
}

export class MainPage extends React.Component {
    render() {
        return <div className="MainPage">
                <Navigation></Navigation>
                <ContentZone></ContentZone>
        </div>
    }
}