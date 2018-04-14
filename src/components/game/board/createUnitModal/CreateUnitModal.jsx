import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import './createUnitModal.css';

class createUnitModal extends React.Component {
  state = {
    coastButtons: false
  };

  determineFleetButtonFunction = () => {
    if (!this.props.multiCoast) {
      return this.props.selectUnitType('fleet', '');
    } else {
      this.setState({ coastButtons: true });
    }
  };

  render() {
    const coastButtons = (
      <div className="coast-buttons">
        <Button onClick={() => this.props.selectUnitType('fleet', 'NC')}>
          NC
        </Button>
        <Button onClick={() => this.props.selectUnitType('fleet', 'SC')}>
          SC
        </Button>
      </div>
    );

    return (
      <div className="create-unit-modal">
        <div className="centered-content">
          <h3>What Type of Unit?</h3>
          <Button onClick={() => this.props.selectUnitType('army', '')}>
            Army
          </Button>
          <Button onClick={() => this.determineFleetButtonFunction()}>
            Fleet
          </Button>
          {this.state.coastButtons ? coastButtons : null}
        </div>
      </div>
    );
  }
}

export default createUnitModal;

createUnitModal.propTypes = {
  selectUnitType: PropTypes.func.isRequired
};
