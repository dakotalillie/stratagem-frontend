import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initializeGame } from '../../actions';
import Board from './board/Board';
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

export default connect(null, { initializeGame })(Game);
