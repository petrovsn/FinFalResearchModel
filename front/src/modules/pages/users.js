import React from "react";
import { CustomTable, CustomTablePagingButtons } from "../widgets/table";

import { useSelector, useDispatch } from 'react-redux';
import { ReduxMemoryAccess } from "../widgets/memory_redux_access";
import { store } from "../../static/storage/storage";
import { finfal_rc } from "../../static/backend_api";
import { InputString, InputInt, InputCheckbox, InputSelector } from "../widgets/inputs";
import { StringViewer, KeyUsageViewer } from "../widgets/outputs";
import { user_table_controller } from "../../static/controllers/user_table_controller";
import { modal_controller } from "../../static/controllers/modal_controller";
import { locales } from "../../static/locales";
import { ExtsX509v3_constructor } from "../widgets/input_exts_constructor";
import { extsx509v3_controller } from "../../static/controllers/exts_controller";
import { subject_name_validation } from "../../static/validators";
import { ErrorMessage } from "../widgets/error_popup";
import { ActionWrapper } from "../widgets/action_wrapper";

export class UsersPage extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.on_load_users()
  }

  on_delete_user = () => {
    let user_action = <UserAction mode='delete' item={user_table_controller.get_selected_item()} />
    modal_controller.show(user_action)
  }

  on_create_user = () => {
    let user_editor = <UserEditor />
    modal_controller.show(user_editor)
  }

  on_load_users = () => {
    console.log("UsersPage.on_load_users")
    user_table_controller.update_content()
  }

  on_ban_user = () => {
    let user_action = <UserAction mode='ban' item={user_table_controller.get_selected_item()} />
    modal_controller.show(user_action)
  }

  on_unban_user = () => {
    let user_action = <UserAction mode='unban' item={user_table_controller.get_selected_item()} />
    modal_controller.show(user_action)
  }


  on_set_role = () =>{
let user_action = <UserAction mode='set_role' item={user_table_controller.get_selected_item()} />
    modal_controller.show(user_action)
  }

  get_button_panel = () => {
    let result = []
    result.push(<button onClick={this.on_load_users}>{locales.get("UpdateTable")}</button>)
    result.push(<button onClick={this.on_create_user}>{locales.get("create")}</button>)

    let available_actions = user_table_controller.get_available_actions()
    console.log("UsersPage.get_button_panel", available_actions)
    for (let i in available_actions) {
      let action_name = available_actions[i]
      switch (action_name) {
        case "view": {
          result.push(<button onClick={this.on_view_user}>{locales.get(action_name)}</button>)
          break
        }
        case "delete": {
          result.push(<button onClick={this.on_delete_user}>{locales.get(action_name)}</button>)
          break
        }
        case "ban": {
          result.push(<button onClick={this.on_ban_user}>{locales.get(action_name)}</button>)
          break
        }
        case "unban": {
          result.push(<button onClick={this.on_unban_user}>{locales.get(action_name)}</button>)
          break
        }
        case 'set_role':{
          result.push(<button onClick={this.on_set_role}>{locales.get(action_name)}</button>)
          break
        }
      }
    }

    return <div className="ActionPanel">{result}</div>
  }

  render() {
    return (<div>
      {this.get_button_panel()}
      <CustomTable
        keys={user_table_controller.get_keys()}
        content={user_table_controller.get_content()}
        marks={user_table_controller.get_selected_idxs()}
        on_item_select={user_table_controller.on_select}
      />
      <CustomTablePagingButtons
        current_page={user_table_controller.get_current_page()}
        on_prev_page={user_table_controller.on_prev_page}
        on_next_page={user_table_controller.on_next_page}
      />
    </div>)
  }
}

class UserEditor extends React.Component {
  constructor() {
    super()
    this.state = {
      login: "",
      password: ""
    }
  }

  onError = (error_description) => {
    let error_message = <ErrorMessage code={error_description["code"]} message={error_description["message"]} />
    modal_controller.show(error_message)
  }

  on_create = () => {
    finfal_rc.post_user(this.state.login,
      this.state.password).then((result) => {
        modal_controller.hide()
        user_table_controller.update_content()
      }).catch((data) => {
        console.log(data["content"])
        this.onError(data["content"])
      })
  }

  on_close = () => {
    modal_controller.hide()
  }



  get_body = () => {
    return <div>
      <InputString label="login" value={this.state.login} onChange={(value) => { this.setState({ "login": value }) }} />
      <InputString label="password" value={this.state.password} onChange={(value) => { this.setState({ "password": value }) }} />
    </div>
  }

  get_buttons = () => {
    return <div className="modal_action_btn_panel">
      <button onClick={this.on_close}>{locales.get("close")}</button>
      <button onClick={this.on_create}>{locales.get("create")}</button>
    </div>

  }

  render() {
    return <div>
      {this.get_body()}
      {this.get_buttons()}
    </div>
  }
}

class UserAction extends ActionWrapper {
  on_close = () => {
    modal_controller.hide()
  }

  get_action_subwidget = () => {
    switch (this.props.mode) {
      case "delete": {
        return <UserActionDelete item={this.props.item} />
      }
      case "ban": {
        return <UserActionBan item={this.props.item} />
      }
      case "unban": {
        return <UserActionUnban item={this.props.item} />
      }
      case 'set_role': {
        return <UserActionSetRole item={this.props.item} />
      }
    }
  }

  render() {
    return (<div className="UserAction">
      <UserViwer item={this.props.item} />
      {this.get_action_subwidget()}
    </div>)
  }
}

class UserActionTemplate extends ActionWrapper {
  on_close = () => {
    modal_controller.hide()
  }

  get_buttons_panel = () => {
    return <div><button onClick={this.on_close}>{locales.get("close")}</button></div>
  }
  get_action_text = () => {

  }
  render() {
    return (<div className="UserActionTemplate">
      {this.get_action_text()}
      {this.get_buttons_panel()}
    </div>)
  }
}


class UserActionSetRole extends UserActionTemplate {
  constructor() {
    super()
    this.state = {
      "role": ""
    }
  }

  on_set_role = () => {
    finfal_rc.set_user_role(this.props.item.login, this.state.role)
      .then((result) => {
        modal_controller.hide()
        user_table_controller.update_content()
      }).catch((data) => {
        this.onError(data["content"])
      })
  }

  get_buttons_panel = () => {
    return <div className="modal_action_btn_panel">
      <button onClick={this.on_close}>{locales.get("close")}</button>
      <button disabled = {this.state.role==""} onClick={this.on_set_role}>{locales.get("do_set_role")}</button>
    </div>
  }

  get_action_text = () => {
    return <div className="modal_action_question_block">
      <InputSelector 
      label="user_set_role_question" 
      options = {["user","admin"]}
      onChange={(value)=>{this.setState({"role":value})}}/>
      </div>
  }
}
class UserActionBan extends UserActionTemplate {
  on_delete = () => {
    finfal_rc.put_user_activity(this.props.item.login, false)
      .then((result) => {
        modal_controller.hide()
        user_table_controller.update_content()
      }).catch((data) => {
        console.log(data["content"])
        this.onError(data["content"])
      })
  }

  get_buttons_panel = () => {
    return <div className="modal_action_btn_panel">
      <button onClick={this.on_close}>{locales.get("close")}</button>
      <button onClick={this.on_delete}>{locales.get("ban")}</button>
    </div>
  }

  get_action_text = () => {
    return <div className="modal_action_question_block"><label>{locales.get("user_ban_question")}</label></div>
  }
}

class UserActionUnban extends UserActionTemplate {
  on_delete = () => {
    finfal_rc.put_user_activity(this.props.item.login, true)
      .then((result) => {
        modal_controller.hide()
        user_table_controller.update_content()
      }).catch((data) => {
        console.log(data["content"])
        this.onError(data["content"])
      })
  }

  get_buttons_panel = () => {
    return <div className="modal_action_btn_panel">
      <button onClick={this.on_close}>{locales.get("close")}</button>
      <button onClick={this.on_delete}>{locales.get("unban")}</button>
    </div>
  }

  get_action_text = () => {
    return <div className="modal_action_question_block"><label>{locales.get("user_unban_question")}</label></div>
  }
}

class UserActionDelete extends UserActionTemplate {
  on_delete = () => {
    finfal_rc.delete_user(this.props.item.login)
      .then((result) => {
        modal_controller.hide()
        user_table_controller.update_content()
      }).catch((data) => {
        console.log(data["content"])
        this.onError(data["content"])
      })
  }

  get_buttons_panel = () => {
    return <div className="modal_action_btn_panel">
      <button onClick={this.on_close}>{locales.get("close")}</button>
      <button onClick={this.on_delete}>{locales.get("delete")}</button>
    </div>
  }

  get_action_text = () => {
    return <div className="modal_action_question_block"><label>{locales.get("user_deletion_question")}</label></div>
  }
}

export class UserViwer extends React.Component {
  constructor() {
    super()
    this.state = {
      login: "",
      role: "",
      is_active: false
    }
  }

  componentDidMount() {
    extsx509v3_controller.upload_from_item(this.props.item.exts)
    this.setState({
      login: this.props.item.login,
      role: this.props.item.role,
      is_active: this.props.item.is_active ? "true" : "false",
    })
  }

  render() {
    return <div>
      <InputString disabled={true} label="login" value={this.state.login} />
      <InputString disabled={true} label="role" value={this.state.role} />
      <InputString disabled={true} label="is_active" value={this.state.is_active} />
    </div>
  }

}