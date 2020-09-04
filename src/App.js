import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Home from './Components/Home/Home';
import Signup from './Components/SignUp/SignUp';
import VerifyEmail from './Components/EmailVerification.js/VerifyEmail';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import RequestEmailVerification from './Components/EmailVerification.js/RequestEmailVerifcation';
import ResetPassword from './Components/Login/ResetPassword';
import Toaster from './Components/Toaster/Toaster';

function App() {

  return (
      <Router>
        <div>
          <NavBar />
          <Toaster />
          <Switch>
            <Route exact path="/login"><Login /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/verify/:token"><VerifyEmail /></Route>
            <Route exact path="/request/:action"><RequestEmailVerification /></Route>
            <Route exact path="/reset/:token"><ResetPassword /></Route>
            <PrivateRoute path="/" component={Home}></PrivateRoute>
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    
  );
}

export default App;
