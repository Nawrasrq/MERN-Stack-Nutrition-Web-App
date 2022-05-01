import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import AddToDailyConsumptionPage from './pages/AddToDailyConsumptionPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordRequestPage from './pages/ResetPasswordRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateMealPage from './pages/CreateMealPage';
import EditGoalsPage from './pages/EditGoalsPage.js';

function App() {
  return (
    <div className="App">
      <Router >
        <Switch>
          <Route path="/" component={LoginPage} exact />
          <Route path="/ResetPasswordRequest" component={ResetPasswordRequestPage} exact />
          <Route path="/api/passwordreset/:id" component={ResetPasswordPage} exact />
          <Route path="/Register" component={RegisterPage} />

          <Route path="/Main" component={MainPage} exact />
          <Route path="/Main/AddToDailyConsumption" component={AddToDailyConsumptionPage} exact />
          <Route path="/Main/AddToDailyConsumption/CreateMeal" component={CreateMealPage} exact />

          <Route path="/Goals" component={GoalsPage} exact />
          <Route path="/Goals/EditGoals" component={EditGoalsPage} exact />

          <Route path="/Profile" component={ProfilePage} exact />

          <Route path="/MacroCalculator" exact>
            MacroCalculator
          </Route>

          <Redirect to="/" />
        </Switch>  
      </Router>
    </div>
  );
}
	
export default App;