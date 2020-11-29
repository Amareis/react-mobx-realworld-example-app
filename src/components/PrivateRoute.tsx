import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import { userStore } from '/stores';

@observer
export default class PrivateRoute extends React.Component<any> {
  render() {
    const { ...restProps } = this.props;
    if (userStore.currentUser) return <Route {...restProps} />;
    return <Redirect to="/" />;
  }
}
