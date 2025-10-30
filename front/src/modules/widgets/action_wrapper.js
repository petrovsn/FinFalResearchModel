import React from "react";
import { modal_controller } from "../../static/controllers/modal_controller";
import { ErrorMessage } from "./error_popup";

export class ActionWrapper extends React.Component {
  onError = (error_description) =>{
    let error_message = <ErrorMessage message={error_description["message"]}/>
    modal_controller.show(error_message)
  }

  on_close = () =>{
    modal_controller.hide()
  }
}