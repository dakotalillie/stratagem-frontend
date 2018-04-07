import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import './boardFooter.css';

const BoardFooter = props => {
  return (
    <div className="board-footer">
      <Container>
        <p className="info-text">{props.infoText}</p>
      </Container>
    </div>
  );
};

export default BoardFooter;

BoardFooter.propTypes = {
  infoText: PropTypes.string.isRequired
};
