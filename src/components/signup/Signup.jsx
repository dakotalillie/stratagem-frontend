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
    first_name: {
      value: '',
      validation: null,
      error: ''
    },
    last_name: {
      value: '',
      validation: null,
      error: ''
    },
    password: {
      value: '',
      validation: null,
      error: ''
    },
    confirm_password: {
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
      first_name: this.state.first_name.value,
      last_name: this.state.last_name.value,
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
            first_name={this.state.first_name}
            last_name={this.state.last_name}
            password={this.state.password}
            confirm_password={this.state.confirm_password}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
        </Container>
      </div>
    );
  }
}

export default connect(null, { signup })(Signup);
