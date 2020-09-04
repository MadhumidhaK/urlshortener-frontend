import "./Login.css"
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row, Container, Alert, FormText } from 'reactstrap';
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { useRecoilState, errorSelector } from 'recoil';
import {  authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { url } from '../../utils/apiURL';
import { useFetch } from '../../hooks/useFetch';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils/validateEmail';

const Login = () => {
    const [ authenticationState, setAuthenticationState ] = useRecoilState(authenticationStateRecoil);
    const history = useHistory();
    const location = useLocation();

    const initialValues = {
        email: "",
        password: ""
    }

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "email"){
            if(!changedObject.value || !validateEmail(changedObject.value)){
                errors.email = "Please enter a valid email";
            }else{
                errors.email = "";
            }
        }
        if(changedObject.param === "password"){
            if(!changedObject.value){
                console.log("password is empty");
                errors.password = "Please enter your password";
            }
            if(changedObject.value){
                console.log("password is not empty");
                errors.password = "";
            }
        }
        return errors;
    }

    const cb = (response) => {
            console.log(response);
            setAuthenticationState({
                isAuthenticated: true,
                token: response.token
            });
            window.localStorage.setItem('auth-token', response.token);
            return history.replace(from);
    }

    const { handleChange, handleSubmit, values, response, responseStatusCode ,errors } = useForm(initialValues, validate, cb);

    const { from } = location.state || { from: { pathname: "/" } };
    console.log(from);
    
    if(authenticationState.isAuthenticated){
        return <Redirect to="/" />
    }
    return (
        <Container>
            <Row>
                <Col md={5} className="bg-light mx-auto mt-3 p-3">
                    <div >
                        { errors.error && <Alert color="danger" className="mt-2">{responseStatusCode === 406 ?
                           <p>{ errors.error}{"  "}<span className="span-link" onClick={() => {
                                return history.push("/request/verify");
                           }}>{" "}Click here</span> to request a new Link</p> : errors.error
                        }</Alert>}
                            <Form onSubmit={(e) => {
                                handleSubmit(e, url + "/user/login");
                            }} autoComplete="off">
                            <FormGroup inline={true}>
                                <Label for="email" className="text-dark">Email</Label>
                                <Input 
                                    type="email" 
                                    value={values.email} 
                                    onChange={handleChange} 
                                    name="email" 
                                    id="email" 
                                    className={errors.email ? "border-danger" : ""}
                                    placeholder="Email" />
                                    {errors.email && 
                                    <FormText color="danger">
                                            {errors.email}
                                    </FormText>}
                            </FormGroup>
                            {' '}
                            <FormGroup inline={true}>
                                <Label for="password" className="text-dark">Password</Label>
                                <Input 
                                    type="password" 
                                    value={values.password} 
                                    onChange={handleChange} 
                                    name="password" 
                                    id="password" 
                                    placeholder="Password"
                                    className={errors.password ? "border-danger" : ""} />
                                    {errors.password && 
                                    <FormText color="danger">
                                            {errors.password}
                                    </FormText>}
                            </FormGroup>
                            {' '}
                            <p className="float-right small-link" color="secondary" role="button" onClick={() => {
                                return history.push("/request/reset");
                            }}>Forgot password?</p>
                            <Button className="mx-auto bg-success w-100">Log in</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;