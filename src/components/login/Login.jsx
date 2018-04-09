import React from 'react';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import './login.css';

const Login = props => {
  return (
    <div className="login">
      <SiteHeader />
      <Container>
        <div className="login-form">
          <Form>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="your@email.com"
              />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="examplePassword"
                placeholder="pass123"
              />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
