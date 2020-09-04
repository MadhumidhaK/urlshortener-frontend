import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row, Container, Alert, FormText, Spinner } from 'reactstrap';
import {  Redirect } from "react-router-dom";
import {  useRecoilValue } from 'recoil';
import {  authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { url } from '../../utils/apiURL';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils/validateEmail';

const Signup = () => {
    const authenticationState = useRecoilValue(authenticationStateRecoil);
    const [ signupState, setSignupState ] = useState(false);
    
    const initialValues = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    }

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "email"){
            if(!changedObject.value || !validateEmail(changedObject.value)){
                errors.email = "Please enter a valid email.";
            }else{
                errors.email = "";
            }
        }
        if(changedObject.param === "password"){
            if(!changedObject.value){
                errors.password = "Please enter your password.";
            }
            if(changedObject.value){
                errors.password = "";
            }
        }

        if(changedObject.param === "confirmPassword"){
            if(!changedObject.value){
                errors.confirmPassword = "Please confirm your password.";
            }
            if(changedObject.value){
                errors.confirmPassword = "";
            }
        }

        if(changedObject.param === "firstName"){
            if(!changedObject.value){
                errors.firstName = "Please enter your first name.";
            }
            if(changedObject.value){
                errors.firstName = "";
            }
        }

        if(changedObject.param === "lastName"){
            if(!changedObject.value){
                errors.lastName = "Please enter your last name.";
            }
            if(changedObject.value){
                errors.lastName = "";
            }
        }

        return errors;
    }

    const cb = (response) => {
            console.log(response);
            setSignupState(true);
    }

    const { handleChange, handleSubmit, values, response, responseStatusCode ,errors, isLoading } = useForm(initialValues, validate, cb)

    if(authenticationState.isAuthenticated){
        return <Redirect to="/" />
    }

    if(signupState){
        return (
            <Container>
                <Row>
                    <Col md="6" className="mx-auto">
                    <div className="m-2">
                        <Alert color="success">
                        <h4 className="alert-heading">Welcome!</h4>
                        <hr />
                        <p>
                            Welcome to MinyURL, your account has been registered. Please verify your account using the verification
                            link sent to your registered email.
                        </p>
                        </Alert>
                     </div>
                    </Col>
                </Row>
            </Container>
        )
    }
    return (
        <Container>
            <Row>
                <Col md={5} className="bg-light mx-auto mt-3 p-3">
                    <div >
                        { errors.error && <Alert color="danger" className="mt-2">{errors.error}</Alert>}
                            <Form onSubmit={(e) => {
                                handleSubmit(e, url + "/user/signup");
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
                            <Row form>
                            <Col md={6}>
                            <FormGroup inline={true}>
                                <Label for="firstName" className="text-dark">First Name</Label>
                                <Input 
                                    type="text" 
                                    value={values.firstName} 
                                    onChange={handleChange} 
                                    name="firstName" 
                                    id="firstName" 
                                    className={errors.firstName ? "border-danger" : ""}
                                    placeholder="First Name" />
                                    {errors.firstName && 
                                    <FormText color="danger">
                                            {errors.firstName}
                                    </FormText>}
                            </FormGroup>
                            </Col>
                            <Col md={6}>
                            <FormGroup inline={true}>
                                <Label for="lastName" className="text-dark">Last Name</Label>
                                <Input 
                                    type="text" 
                                    value={values.lastName} 
                                    onChange={handleChange} 
                                    name="lastName" 
                                    id="lastName" 
                                    className={errors.lastName ? "border-danger" : ""}
                                    placeholder="Last Name" />
                                    {errors.lastName && 
                                    <FormText color="danger">
                                            {errors.lastName}
                                    </FormText>}
                            </FormGroup>
                            </Col>
                            </Row>
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
                            <FormGroup inline={true}>
                                <Label for="confirmPassword" className="text-dark">Confirm Password</Label>
                                <Input 
                                    type="password" 
                                    value={values.confirmPassword} 
                                    onChange={handleChange} 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                    placeholder="Re-enter your Password"
                                    className={errors.confirmPassword ? "border-danger" : ""} />
                                    {errors.confirmPassword && 
                                    <FormText color="danger">
                                            {errors.confirmPassword}
                                    </FormText>}
                            </FormGroup>
                            {' '}
                            {!isLoading ?  
                            <Button className="mx-auto bg-success w-100">Sign up</Button> : 
                            (  <div className="w-100 text-center">
                                    <Spinner className="mx-auto" type="grow" color="success" />
                                </div>)}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Signup;