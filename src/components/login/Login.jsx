import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import { login } from '../../actions';
import './login.css';

class Login extends React.Component {
  state = {
    username: {
      value: '',
      validation: null,
      error: ''
    },
    password: {
      value: '',
      validation: null,
      error: ''
    },
    error: ''
  };

  handleChange = (e, target) => {
    const newState = { ...this.state };
    newState[target].value = e.target.value;
    this.setState(newState);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username.value, this.state.password.value);
  };

  render() {
    return (
      <div className="login">
        <SiteHeader />
        <Container>
          <div className="login-form">
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="janeDoe"
                  value={this.state.username.value}
                  onChange={e => this.handleChange(e, 'username')}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="pass123"
                  value={this.state.password.value}
                  onChange={e => this.handleChange(e, 'password')}
                />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Form>
          </div>
        </Container>
      </div>
    );
  }
}

export default connect(null, { login })(Login);
