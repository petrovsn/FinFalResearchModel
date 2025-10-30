import React from "react"
import { modal_controller } from "../../static/controllers/modal_controller"
import { locales } from "../../static/locales"

export class ErrorMessage extends React.Component {
  on_close = () => {
    modal_controller.hide()
  }

  get_unknown_message = () => {
    return <div className="PopupMessage">
      <label>{locales.get("unknown_message")}</label>
      <button onClick={this.on_close}>{locales.get("close")}</button>
    </div>
  }

  get_custom_message = () => {
    return <div className="PopupMessage">
      <label>{locales.get(this.props.message)}</label>
      <button onClick={this.on_close}>{locales.get("close")}</button>
    </div>
  }

  render() {
    if (this.props.message){
      return this.get_custom_message()
    }
    return this.get_unknown_message()
  }
}


export class InfoMessage extends React.Component {
  on_close = () => {
    modal_controller.hide()
  }
  render() {
    return (
      <div className="PopupMessage">
        <label>{locales.get(this.props.message)}</label>
        <button onClick={this.on_close}>{locales.get("close")}</button>
      </div>
    )
  }
}