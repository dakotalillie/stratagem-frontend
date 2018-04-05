import React from 'react';
import { Container } from 'reactstrap';
import BoardMap from './boardMap/BoardMap';

const Board = props => {
  return (
    <div className="board">
      <Container>
        <BoardMap />
      </Container>
    </div>
  );
};

export default Board;
