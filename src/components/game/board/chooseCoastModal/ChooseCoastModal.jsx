import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import './chooseCoastModal.css';

const ChooseCoastModal = props => {
  return (
    <div className="choose-coast-modal">
      <div className="centered-content">
        <h3>Which Coast?</h3>
        <Button onClick={() => props.selectCoast(props.coasts[0])}>
          {coastFullName(props.coasts[0])}
        </Button>
        <Button onClick={() => props.selectCoast(props.coasts[1])}>
          {coastFullName(props.coasts[1])}
        </Button>
      </div>
    </div>
  );
};

export default ChooseCoastModal;

ChooseCoastModal.propTypes = {
  coasts: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectCoast: PropTypes.func.isRequired
};

// helpers

function coastFullName(coastAbbr) {
  switch (coastAbbr) {
    case 'NC':
      return 'North';
    case 'SC':
      return 'South';
    case 'EC':
      return 'East';
    default:
      throw new Error('Coast in coastFullName not recognized: ' + coastAbbr);
  }
}
