import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { noToken, fetchCurrentUser } from './actions/';
import withAuth from './components/hoc/withAuth';
import Welcome from './components/welcome/Welcome';
import GamesList from './components/gamesList/GamesList';
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
        <Route exact path="/" component={withAuth(Welcome, true)} />
        <Route exact path="/login" component={withAuth(Login, true)} />
        <Route exact path="/signup" component={withAuth(Signup, true)} />
        <Route exact path="/games" component={withAuth(GamesList)} />
        <Route path="/games/:game_id" component={withAuth(Game)} />
      </div>
    );
  }
}

export default withRouter(connect(null, { noToken, fetchCurrentUser })(App));
