import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import NoMatch from '../NoMatch';

function AppRoutes() {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={NoMatch} />
      </Switch>
    </Fragment>
  );
}

export default AppRoutes;
