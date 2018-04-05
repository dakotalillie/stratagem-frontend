import React from 'react';
import Board from './board/Board';
import './game.css';

const Game = props => {
  return (
    <div className="game">
      <Board />
    </div>
  );
};

export default Game;
