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
    const sorted_games = Object.keys(this.props.games).sort((a, b) => {
      const a_created_at = this.props.games[a].current_turn.created_at;
      const b_created_at = this.props.games[b].current_turn.created_at;
      return new Date(b_created_at) - new Date(a_created_at);
    });
    const games_list = sorted_games.map(gameId => {
      const game = this.props.games[gameId];
      return (
        <tr key={gameId}>
          <td>
            <Link to={`/games/${gameId}`}>{game.title}</Link>
          </td>
          <td>all</td>
          <td>
            {game.current_turn.phase}, {game.current_turn.season}{' '}
            {game.current_turn.year}
          </td>
          <td>
            <Moment fromNow>{game.current_turn.created_at}</Moment>
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
              <tbody>{games_list}</tbody>
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

// helpers

// function title(str) {
//   if (str !== undefined) {
//     const strArr = str.split('');
//     strArr[0] = strArr[0].toUpperCase();
//     return strArr.join('');
//   }
//   return '';
// }
