import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initializeGame, fetchGameData } from '../../actions';
import Board from './board/Board';
import SiteHeader from '../shared/siteHeader/SiteHeader';
// import OrderAlert from './orderAlert/OrderAlert';
import './game.css';

class Game extends React.Component {
  componentDidMount() {
    this.props.fetchGameData(this.props.match.params.game_id);
  }

  render() {
    return (
      <div className="game">
        <SiteHeader />
        <Board />
      </div>
    );
  }
}

Game.propTypes = {
  initializeGame: PropTypes.func
};

const connectStateToProps = state => ({
  orders: state.orders
});

export default connect(connectStateToProps, { fetchGameData })(Game);
