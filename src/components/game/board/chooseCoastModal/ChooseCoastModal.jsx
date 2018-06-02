import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import './chooseCoastModal.css';

export default function ChooseCoastModal({ coasts, selectCoast }) {

  function coastFullName(coastAbbr) {
    switch (coastAbbr) {
      case 'NC':
        return 'North';
      case 'SC':
        return 'South';
      case 'EC':
        return 'East';
      default:
        return '';
    }
  }

  return (
    <div className="choose-coast-modal">
      <div className="centered-content">
        <h3>Which Coast?</h3>
        <Button onClick={() => selectCoast(coasts[0])}>
          {coastFullName(coasts[0])}
        </Button>
        <Button onClick={() => selectCoast(coasts[1])}>
          {coastFullName(coasts[1])}
        </Button>
      </div>
    </div>
  );
};

ChooseCoastModal.propTypes = {
  coasts: PropTypes.arrayOf(PropTypes.oneOf(['NC', 'SC', 'EC'])).isRequired,
  selectCoast: PropTypes.func.isRequired
};