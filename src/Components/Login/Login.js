import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row, Container } from 'reactstrap';
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();

    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: ""
    });

    const onInputChange = (event) => {
        const { name, value } = event.target;
        setLoginCredentials({
            ...loginCredentials,
            [name]: value
        });
    }

    const loginHandler = (event) => {
        event.preventDefault();
        let responseStatusCode;
        fetch("https://minyurl.herokuapp.com/user/login", {
          method: "POST",
          credentials: 'include',
          mode: "cors", 
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email: loginCredentials.email, password: loginCredentials.password})
        }).then(res => {
            console.log(res);
            responseStatusCode = res.status;
            return res.json();
        }).then(res => {
            console.log(res);
            if(responseStatusCode === 200){
                return history.push("/");
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <Container>
            <Row>
                <Col md={5} className="bg-secondary mx-auto mt-3 p-3">
                    <div >
                        <Form onSubmit={loginHandler}>
                            <FormGroup inline={true}>
                                <Label for="email" hidden>Email</Label>
                                <Input 
                                    type="email" 
                                    value={loginCredentials.email} 
                                    onChange={onInputChange} 
                                    name="email" 
                                    id="email" 
                                    placeholder="Email" />
                            </FormGroup>
                            {' '}
                            <FormGroup inline={true}>
                                <Label for="password" hidden>Password</Label>
                                <Input 
                                    type="password" 
                                    value={loginCredentials.password} 
                                    onChange={onInputChange} 
                                    name="password" 
                                    id="password" 
                                    placeholder="Password" />
                            </FormGroup>
                            {' '}
                            <Button className="mx-auto bg-success w-100">Log in</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;