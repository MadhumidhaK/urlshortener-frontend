import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row, Container, Alert, FormText } from 'reactstrap';
import { useHistory, useLocation, Redirect, useParams } from "react-router-dom";
import { useRecoilState, errorSelector, useRecoilValue } from 'recoil';
import {  authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { url } from '../../utils/apiURL';
import { useFetch } from '../../hooks/useFetch';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils/validateEmail';


const RequestEmailVerification = () => {
    const authenticationState = useRecoilValue(authenticationStateRecoil);
    const [ isEmailSent, setIsEmailSent ] = useState(false);
    const initialValues = {
        email: ""
    }

    const { action } = useParams();

    let isVerification;
    

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "email"){
            if(!changedObject.value || !validateEmail(changedObject.value)){
                errors.email = "Please enter a valid email";
            }else{
                errors.email = "";
            }
        }
        return errors;
    }


    const cb = (response) => {
        console.log(response);
        setIsEmailSent({
            isEmailSent: true
        });
    }

    const { handleChange, handleSubmit, values, response, responseStatusCode ,errors, isLoading } = useForm(initialValues, validate, cb)

    if(action === "verify"){
        isVerification = true
    }else if(action === "reset"){
        isVerification = false
    }else{
        return <Redirect to="/404" />
    }


    if(authenticationState.isAuthenticated){
        return <Redirect to="/" />
    }

    if(isEmailSent){
        return (
            <Container>
                <Row>
                    <Col md="6" className="mx-auto">
                    <div className="m-2">
                        <Alert color="success">
                            <h4 className="alert-heading">Hello!</h4>
                            <hr />
                            <p>
                                {action === "verify" ?
                                `New verification link has been sent to your registered mail. Please verify your account.
                                    Link will expire in an hour.` :
                                `New password reset request link has been sent to your registered mail. Please reset your password.
                                 Link will expire in an hour.`   
                            }
                            </p>
                        </Alert>
                     </div>
                    </Col>
                </Row>
            </Container>
        )
    }


    return(
        <Container>
            <Row>
                <Col md={5} className="bg-light mx-auto mt-3 p-3">
                    <div >
                        { errors.error && <Alert color="danger" className="mt-2">{errors.error}</Alert>}
                            <Form onSubmit={(e) => {
                                handleSubmit(e, url+"/user" + (action === "verify" ? "/requestverifyemail" : "/forgotpassword"));
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
                            <Button className="mx-auto bg-success w-100">Submit</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}



export default RequestEmailVerification;