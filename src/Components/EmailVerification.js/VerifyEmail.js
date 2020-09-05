import "./VerifyEmail.css";
import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row, Container, Alert, FormText, Spinner } from 'reactstrap';
import { useHistory, useLocation, Redirect, useParams } from "react-router-dom";
import { useRecoilState, errorSelector } from 'recoil';
import {  authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { url } from '../../utils/apiURL';
import { useFetch } from '../../hooks/useFetch';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils/validateEmail';
import { toastStateRecoil } from "../../sharedStates/toastState";

const VerifyEmail = () => {
    const [ authenticationState, setAuthenticationState ] = useRecoilState(authenticationStateRecoil);
    const [toastState, setToastState] = useRecoilState(toastStateRecoil)
    const history = useHistory();
    const { token } = useParams();
    const initialValues = {
        email: "",
        password: "",
        token: token
    }

    // useEffect(() => {
    //     if(authenticationState.isAuthenticated){
    //         window.localStorage.removeItem('auth-token');
    //         setAuthenticationState({
    //             isAuthenticated: false,
    //             token: undefined
    //         });
    //     }
    // }, [])

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
                errors.password = "Please enter your password";
            }
            if(changedObject.value){
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
            setToastState({
                isOpen: true,
                toastBody: "Your email has been verified.",
                toastHeader: "Verified Successfully!",
                className: "bg-success"
            });
            window.localStorage.setItem('auth-token', response.token);
            return history.push("/");
    }

    const { handleChange, handleSubmit, values, response, responseStatusCode ,errors, isLoading } = useForm(initialValues, validate, cb)
    

    if(authenticationState.isAuthenticated){
        return <Redirect to="/" />
    }

    return (
        <Container>
            <Row>
                <Col md={5} className="bg-light mx-auto mt-3 p-3">
                    <div >
                        { errors.error && <Alert color="danger" className="mt-2">{responseStatusCode === 410 ?
                           <p>{ errors.error}{"  "}<span className="span-link" onClick={() => {
                               console.log("clicked")
                                return history.push("/request/verify");
                            }}>Click here</span> to request a new Link</p> : errors.error
                        }</Alert>}
                            <Form onSubmit={(e) => {
                                handleSubmit(e, url + "/user/verifyemail");
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
                            {isLoading ? 
                                <div className="text-center">
                                    <br />
                                    <Spinner type="grow" color="warning"></Spinner>
                                </div>
                                :
                            <Button className="mx-auto bg-success w-100">Verify</Button>}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default VerifyEmail;