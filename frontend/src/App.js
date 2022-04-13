import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProgressPage from './pages/ProgressPage';
import ReportsPage from './pages/ReportsPage';
import AddToDailyConsumptionPage from './pages/AddToDailyConsumptionPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordRequestPage from './pages/ResetPasswordRequestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateMealPage from './pages/CreateMealPage';
import GoalsPage from './pages/GoalsPage';
import EditGoalsPage from './pages/EditGoalsPage.js';

function App() {
  return (
    <Router >
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/ResetPasswordRequest" exact>
          <ResetPasswordRequestPage />
        </Route>
        <Route path="/api/passwordreset/:id" exact>
          <ResetPasswordPage />
        </Route>
        <Route path="/Register" exact>
          <RegisterPage />
        </Route>
        <Route path="/Main" exact>
          <MainPage />
        </Route>
        <Route path="/Progress" exact>
          <ProgressPage />
        </Route>
        <Route path="/Reports" exact>
          <ReportsPage />
        </Route>
        <Route path="/AddToDailyConsumption" exact>
          <AddToDailyConsumptionPage />
        </Route>
        <Route path="/CreateMeal" exact>
          <CreateMealPage />
        </Route>
        <Route path="/Goals" exact>
          <GoalsPage />
        </Route>
        <Route path="/Goals/EditGoals" exact>
          <EditGoalsPage />
        </Route>
        <Route path="/MacroCalculator" exact>
          MacroCalculator
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}
	
export default App;