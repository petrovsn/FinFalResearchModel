
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoginPage } from './modules/pages/login_page';
import { MainPage } from './modules/pages/main_page';
import { ReduxMemoryAccess } from './modules/widgets/memory_redux_access';
import { Modal } from './modules/widgets/modal';
import { auth_controller } from './static/controllers/auth_controller';
import { config_loader } from './static/config_loader';


class App extends ReduxMemoryAccess {
  constructor() {
    super()
  }

  render() {
    let view_page = <div></div>
    if (auth_controller.authorised()) {
      view_page = <MainPage></MainPage>
    }
    else {
      view_page = <LoginPage></LoginPage>
    }

    return <div>
      {view_page}
      <Modal show={this.state.modal.show}>
        {this.state.modal.content}
      </Modal>
    </div>
  }
}


 /*
       */
export default App;
