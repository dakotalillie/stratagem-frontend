import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, ListGroup, ListGroupItem } from 'reactstrap';
import { createSandbox } from '../../actions';
import SiteHeader from '../shared/siteHeader/SiteHeader';

class GamesList extends React.Component {
  handleNewSandbox = () => {
    // const countries = ['Au', 'En', 'Fr', 'Ge', 'It', 'Ru', 'Tu'];
    // const country_data = countries.reduce((memo, abbr) => {
    //   memo[abbr] = this.props.currentUser.id;
    //   return memo;
    // }, {});
    // will make call to createGame method here.
    this.props.createSandbox();
  };

  render() {
    const games_list = Object.keys(this.props.games).map(gameId => {
      const game = this.props.games[gameId];
      return (
        <ListGroupItem key={gameId} tag="button" action>
          <Link to={`/games/${gameId}`}>{game.title}</Link>
        </ListGroupItem>
      );
    });

    return (
      <div className="games-list">
        <SiteHeader />
        <Container>
          <h2>Your Games:</h2>
          <Button onClick={this.handleNewSandbox}>New Sandbox</Button>
          <ListGroup>{games_list}</ListGroup>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    games: state.games
  };
}

export default connect(mapStateToProps, { createSandbox })(GamesList);
