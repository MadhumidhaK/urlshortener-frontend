import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {  authenticationStateRecoil } from "../../sharedStates/authenticationState";
import Home from "../Home/Home";


const PrivateRoute = function ({ component: Component, ...rest}){
    const authenticationState = useRecoilValue(authenticationStateRecoil);
    console.log(authenticationState)
    return <Route {...rest} render={({location}) => {
            return authenticationState.isAuthenticated ? ( <Component /> ) : <Redirect to={{
                pathname: "/login",
                state: { from : location}
            }} 
            />
    }} />
}

export default PrivateRoute;
