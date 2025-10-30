import React from "react";
import { modal_controller } from "../../static/controllers/modal_controller";
import { ErrorMessage } from "./error_popup";
import { locales } from "../../static/locales";
export class ActionWrapper extends React.Component {
  onError = (error_description) =>{
    let error_message = <ErrorMessage message={error_description["message"]}/>
    modal_controller.show(error_message)
  }

  get_default_btn_panel = (action_name, action_callback) =>{
    return <div>
      <button onClick={action_callback}>{locales.get(action_name)}</button>
      <button onClick={modal_controller.hide}>{locales.get("close")}</button>
    </div>
  }

  hide = () =>{
    modal_controller.hide()
  }

  on_close = () =>{
    modal_controller.hide()
  }
}