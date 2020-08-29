import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { RecoilRoot } from 'recoil';
import NavBar from './Components/NavBar/NavBar';
import Login from './Components/Login/Login';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/login"><Login /></Route>
          </Switch>
        </div>
      </Router>
    </RecoilRoot>
    
  );
}

export default App;
