import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import './signupForm.css';

function signupForm(props) {
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
          <Label for="first_name">First Name</Label>
          <Input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="Jane"
            value={props.first_name.value}
            onChange={e => props.handleChange(e, 'first_name')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="last_name">Last Name</Label>
          <Input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Doe"
            value={props.last_name.value}
            onChange={e => props.handleChange(e, 'last_name')}
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
          <Label for="confirm_password">Confirm Password</Label>
          <Input
            type="password"
            name="confirm_password"
            id="confirm_password"
            placeholder="pass123"
            value={props.confirm_password.value}
            onChange={e => props.handleChange(e, 'confirm_password')}
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

signupForm.propTypes = {
  username: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  email: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  first_name: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  last_name: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  password: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  confirm_password: PropTypes.shape({
    value: PropTypes.string.isRequired,
    validation: PropTypes.string,
    error: PropTypes.string.isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default signupForm;
