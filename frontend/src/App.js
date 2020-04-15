import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import routeOptions from './routes';

const App = () => {
  const routes = routeOptions.map(({ exact, component, path }, index) => (
    <Route key={index} exact={exact} component={component} path={path} />
  ));
  return (
    <Fragment>
      <Switch>{routes}</Switch>
    </Fragment>
  );
};

export default App;
