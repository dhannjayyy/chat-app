import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import SignIn from './pages/Signin';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';


function App() {
  return (
    <Switch>
      <PublicRoute path="/signin">
        <SignIn />
      </PublicRoute>
      <PrivateRoute path="/" random="rando">
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
