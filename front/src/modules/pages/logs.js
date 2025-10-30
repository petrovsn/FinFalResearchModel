import React from "react";
import { CustomTable, CustomTablePagingButtons } from "../widgets/table";

import { useSelector, useDispatch } from 'react-redux';
import { ReduxMemoryAccess } from "../widgets/memory_redux_access";
import { store } from "../../static/storage/storage";
import { finfal_rc } from "../../static/backend_api";
import { InputString, InputInt, InputCheckbox, InputSelector } from "../widgets/inputs";
import { StringViewer, KeyUsageViewer } from "../widgets/outputs";
import { modal_controller } from "../../static/controllers/modal_controller";
import { locales } from "../../static/locales";
import { ExtsX509v3_constructor } from "../widgets/input_exts_constructor";
import { extsx509v3_controller } from "../../static/controllers/exts_controller";
import { subject_name_validation } from "../../static/validators";
import { file_encoder } from "../../static/encode_utils";
import { ActionWrapper } from "../widgets/action_wrapper";
import { scert_table_controller } from "../../static/controllers/scert_table_controller";
import { scilog_table_controller } from "../../static/controllers/log_controller";
import { TimeIntervalSelector } from "../widgets/time_interval_selector";
import { LogFitlerLayerWidget } from "../widgets/filters_layer_widget";
export class LogsPage extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.on_load_logs()
  }


  on_load_logs = () => {
    scilog_table_controller.update_content()
  }

  get_button_panel = () => {
    let result = []
    result.push(<button onClick={this.on_load_logs}>{locales.get("UpdateTable")}</button>)
    return <div className = "ActionPanel">{result}</div>
  }

  render() {
    return (<div>

      <TimeIntervalSelector
        onUpdate={this.on_load_logs} />

      <LogFitlerLayerWidget selector_options = {["success", "failed"]}/>
      {this.get_button_panel()}
      <CustomTable
        keys={scilog_table_controller.get_keys()}
        content={scilog_table_controller.get_content()}
      />
      <CustomTablePagingButtons
        current_page={scilog_table_controller.get_current_page()}
        on_prev_page={scilog_table_controller.on_prev_page}
        on_next_page={scilog_table_controller.on_next_page}
      />
    </div>)
  }
}