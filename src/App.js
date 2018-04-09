import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { noToken, fetchCurrentUser } from './actions/';
import Welcome from './components/welcome/Welcome';
import Game from './components/game/Game';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import './App.css';

class App extends Component {
  componentDidMount() {
    let token = localStorage.getItem('token');
    if (token) {
      this.props.fetchCurrentUser();
    } else {
      this.props.noToken();
    }
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route
          exact
          path="/game"
          render={() => {
            if (this.props.isLoggedIn) {
              return <Game />;
            } else {
              return <Redirect to="/welcome" />;
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default withRouter(
  connect(mapStateToProps, { noToken, fetchCurrentUser })(App)
);
