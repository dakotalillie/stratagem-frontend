import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Table, Row } from 'reactstrap';
import Moment from 'react-moment';
import { createSandbox } from '../../actions';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import './gamesList.css';

class GamesList extends React.Component {
  handleNewSandbox = () => {
    this.props.createSandbox();
  };

  render() {
    const sortedGames = Object.keys(this.props.games).sort((a, b) => {
      const aCreatedAt = this.props.games[a].currentTurn.createdAt;
      const bCreatedAt = this.props.games[b].currentTurn.createdAt;
      return new Date(bCreatedAt) - new Date(aCreatedAt);
    });
    const gamesList = sortedGames.map(gameId => {
      const game = this.props.games[gameId];
      return (
        <tr key={gameId}>
          <td>
            <Link to={`/games/${gameId}`}>{game.title}</Link>
          </td>
          <td>all</td>
          <td>
            {game.currentTurn.phase}, {game.currentTurn.season}{' '}
            {game.currentTurn.year}
          </td>
          <td>
            <Moment fromNow>{game.currentTurn.createdAt}</Moment>
          </td>
        </tr>
      );
    });

    return (
      <div className="games-list">
        <SiteHeader />
        <Container className="content">
          <Row>
            <Col sm="6" className="title-col">
              <h2>Your Games</h2>
            </Col>
            <Col sm="6" className="button-col">
              <Button onClick={this.handleNewSandbox}>New Sandbox</Button>
            </Col>
          </Row>
          <Row>
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Countries</th>
                  <th>Current Turn</th>
                  <th>Last Played</th>
                </tr>
              </thead>
              <tbody>{gamesList}</tbody>
            </Table>
          </Row>
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
