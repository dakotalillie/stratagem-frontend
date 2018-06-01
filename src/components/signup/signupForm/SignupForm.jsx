import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import CustomPropTypes from '../../../utils/customPropTypes';
import './signupForm.css';

export default function signupForm(props) {
  return (
    <div className="signup-form">
      <Form onSubmit={props.handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="janeDoe"
            value={props.username.value}
            onChange={e => props.handleChange(e, 'username')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="your@email.com"
            value={props.email.value}
            onChange={e => props.handleChange(e, 'email')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="first-name">First Name</Label>
          <Input
            type="text"
            name="firstName"
            id="first-name"
            placeholder="Jane"
            value={props.firstNname.value}
            onChange={e => props.handleChange(e, 'firstName')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="last-name">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            id="last-name"
            placeholder="Doe"
            value={props.lastName.value}
            onChange={e => props.handleChange(e, 'lastName')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="pass123"
            value={props.password.value}
            onChange={e => props.handleChange(e, 'password')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirm-password">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirm-password"
            placeholder="pass123"
            value={props.confirmPassword.value}
            onChange={e => props.handleChange(e, 'confirmPassword')}
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

signupForm.propTypes = {
  username: CustomPropTypes.formField.isRequired,
  email: CustomPropTypes.formField.isRequired,
  firstName: CustomPropTypes.formField.isRequired,
  lastName: CustomPropTypes.formField.isRequired,
  password: CustomPropTypes.formField.isRequired,
  confirmPassword: CustomPropTypes.formField.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
