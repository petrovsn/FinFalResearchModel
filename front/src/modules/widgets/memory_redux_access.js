import React from "react";
import { store } from "../../static/storage/storage";

export class ReduxMemoryAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: store.getState().navigation,
            auth: store.getState().auth,
            profiles: store.getState().profiles,
            modal: store.getState().modal,
            mako: store.getState().mako,
        };
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                counter: store.getState().counter,
                time_interval: store.getState().time,
                navigation: store.getState().navigation,
                auth: store.getState().auth,
                profiles: store.getState().profiles,
                modal: store.getState().modal,
                mako: store.getState().mako,
            });
        });
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                counter: store.getState().counter,
                time_interval: store.getState().time,
                navigation: store.getState().navigation,
                auth: store.getState().auth,
                profiles: store.getState().profiles,
                modal: store.getState().modal,
                mako: store.getState().mako,
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}