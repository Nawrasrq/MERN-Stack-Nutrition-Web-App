import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router >
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/Register" exact>
          <RegisterPage />
        </Route>
        <Route path="/Main" exact>
          <MainPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}
	
export default App;