import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import SignupForm from './signupForm/SignupForm';
import { signup } from '../../actions/';

class Signup extends React.Component {
  state = {
    username: {
      value: '',
      validation: null,
      error: ''
    },
    email: {
      value: '',
      validation: null,
      error: ''
    },
    firstName: {
      value: '',
      validation: null,
      error: ''
    },
    lastName: {
      value: '',
      validation: null,
      error: ''
    },
    password: {
      value: '',
      validation: null,
      error: ''
    },
    confirmPassword: {
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
    const params = {
      username: this.state.username.value,
      email: this.state.email.value,
      firstName: this.state.firstName.value,
      lastName: this.state.lastName.value,
      password: this.state.password.value
    };
    this.props.signup(params);
  };

  render() {
    return (
      <div className="signup">
        <SiteHeader />
        <Container>
          <SignupForm
            username={this.state.username}
            email={this.state.email}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            password={this.state.password}
            confirmPassword={this.state.confirmPassword}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
        </Container>
      </div>
    );
  }
}

export default connect(null, { signup })(Signup);
