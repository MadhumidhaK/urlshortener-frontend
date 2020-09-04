import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { RecoilRoot, useRecoilState } from 'recoil';
import NavBar from './Components/NavBar/NavBar';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Home from './Components/Home/Home';
import { authenticationStateRecoil } from './sharedStates/authenticationState';
import { url } from './utils/apiURL';
import Signup from './Components/SignUp/SignUp';
import VerifyEmail from './Components/EmailVerification.js/VerifyEmail';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import RequestEmailVerification from './Components/EmailVerification.js/RequestEmailVerifcation';
import ResetPassword from './Components/Login/ResetPassword';
import Toaster from './Components/Toaster/Toaster';

function App() {

  const [authenticationState, setAuthenticationState] = useRecoilState(authenticationStateRecoil);

  const verifyToken = async () => { 
    try{
        let authToken;
        console.log("from local storage")
        const storedToken = window.localStorage.getItem('auth-token');
        const res = await fetch( url + "/user/verifytoken", {
                                    method: "GET",
                                    headers:{
                                        'Authorization': storedToken
                                    },
                                    credentials: 'include',
                                });
        const { isLoggedIn } =await res.json();

        if(isLoggedIn ){
            setAuthenticationState({
              isAuthenticated: true,
              token: storedToken
            })
        }else{
            setAuthenticationState({
                isAuthenticated: false,
                token: undefined
            })
        }
    }catch(err){
        console.log(err)
    }
  }
  useEffect(function(){
      verifyToken();
  }, [])
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
