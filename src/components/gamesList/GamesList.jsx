import React from 'react';
import { connect } from 'react-redux';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import SiteHeader from '../shared/siteHeader/SiteHeader';

function GamesList(props) {
  const games_list = Object.keys(props.games).map(gameId => {
    const game = props.games[gameId];
    return (
      <ListGroupItem key={gameId} tag="button" action>
        {game.title}
      </ListGroupItem>
    );
  });

  return (
    <div className="games-list">
      <SiteHeader />
      <Container>
        <h2>Your Games:</h2>
        <ListGroup>{games_list}</ListGroup>
      </Container>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    games: state.games
  };
}

export default connect(mapStateToProps, null)(GamesList);
