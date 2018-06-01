import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import './boardFooter.css';

export default function BoardFooter({ infoText }) {
  return (
    <div className="board-footer">
      <Container>
        <p className="info-text">{infoText}</p>
      </Container>
    </div>
  );
};

BoardFooter.propTypes = {
  infoText: PropTypes.string.isRequired
};
