import { finfal_rc } from "../backend_api"
import { store } from "../storage/storage"
import { set_token, login, set_login } from "../storage/slices/authSlice"

class AuthController{
    constructor(){
        this.auth_data = store.getState().auth
        this.unsubscribe = store.subscribe(() => {
                this.auth_data = store.getState().auth
        })
    }
    
    auth = (username, password, onSuccess, onFailure)=>{
        console.log("AuthController.auth")
        finfal_rc.auth(username, password)
        .then((data)=>{
            console.log("AuthController.auth",data)
            store.dispatch(set_login(username))
            store.dispatch(set_token(data["access_token"]))
            finfal_rc.set_token(data["access_token"])
            store.dispatch(login(data["role"]))
            onSuccess()
        }).catch((error) => {
            onFailure()
        })
    }
    get_login = () =>{
        return this.auth_data.login
    }

    get_role = () =>{
        return this.auth_data.role
    }

    get_token = () =>{
        return this.auth_data.token
    }

    authorised = () =>{
        return this.auth_data.authorised
    }
}

export const auth_controller = new AuthController()