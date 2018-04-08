import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initializeGame } from '../../actions';
import Board from './board/Board';
import OrderAlert from './orderAlert/OrderAlert';
import './game.css';

class Game extends React.Component {
  componentDidMount() {
    this.props.initializeGame();
  }

  render() {
    return (
      <div className="game">
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

export default connect(connectStateToProps, { initializeGame })(Game);
