import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { noToken, fetchCurrentUser } from './actions/';
import Welcome from './components/welcome/Welcome';
import Game from './components/game/Game';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={() => {
            if (this.props.isLoggedIn) {
              return <Game />;
            } else {
              return <Redirect to="/welcome" />;
            }
          }}
        />
        <Route exact path="/welcome" component={Welcome} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default withRouter(connect(mapStateToProps, {})(App));
