import Header from "./components/Header";
import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import {commonStore, userStore} from "/stores"

import PrivateRoute from "/components/PrivateRoute";

import Login from "/pages/Login";
import Home from "/pages/Home";
import Register from "/pages/Register";
import Article from "/pages/Article";
import Editor from "/pages/Editor";
import Profile from "/pages/Profile";
import Settings from "/pages/Settings";

const wr: any = withRouter

@wr
@observer
export default class App extends React.Component<any> {
  componentWillMount() {
    if (!commonStore.token) {
      commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    if (commonStore.token) {
      userStore
        .pullUser()
        .finally(() => commonStore.setAppLoaded());
    }
  }

  render() {
    if (commonStore.appLoaded) {
      return (
        <div>
          <Header />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug?" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <PrivateRoute path="/settings" component={Settings} />
            <Route path="/@:username" component={Profile} />
            <Route path="/@:username/favorites" component={Profile} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      );
    }
    return <Header />;
  }
}
