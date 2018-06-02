import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import './createUnitModal.css';

export default class createUnitModal extends React.Component {

  static propTypes = {
    multiCoast: PropTypes.bool.isRequired,
    selectUnitType: PropTypes.func.isRequired
  };

  state = {
    coastButtons: false
  };

  determineFleetButtonFunction = () => {
    const { multiCoast, selectUnitType } = this.props;
    if (!multiCoast) {
      return selectUnitType('fleet', '');
    } else {
      this.setState({ coastButtons: true });
    }
  };

  render() {
    const { selectUnitType } = this.props;
    const coastButtons = (
      <div className="coast-buttons">
        <Button onClick={() => selectUnitType('fleet', 'NC')}>
          NC
        </Button>
        <Button onClick={() => selectUnitType('fleet', 'SC')}>
          SC
        </Button>
      </div>
    );

    return (
      <div className="create-unit-modal">
        <div className="centered-content">
          <h3>What Type of Unit?</h3>
          <Button onClick={() => selectUnitType('army', '')}>
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