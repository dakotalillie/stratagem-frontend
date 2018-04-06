import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { createOrder } from '../../../actions';
import BoardMap from './boardMap/BoardMap';
import { findPotentialMoves, determineCoast, mapUnits } from './boardUtils';
import territoriesData from '../../../utils/territories.json';
import countriesData from '../../../utils/countries.json';

class Board extends React.Component {
  state = {
    hovered: null,
    selected: null,
    potentialMoves: [],
    coastOptions: {},
    supportMode: false,
    convoyMode: false,
    tmpMoveStorage: {},
    chooseCoastModal: false
  };

  resetState = () => {
    this.setState({
      selected: null,
      potentialMoves: [],
      coastOptions: {},
      supportMode: false,
      convoyMode: false,
      tmpMoveStorage: {},
      chooseCoastModal: false
    });
  };

  handleMouseEnter = e => {
    const TERRITORY = territoriesData[e.target.id];
    if (TERRITORY != null) {
      this.setState({ hovered: TERRITORY });
    }
  };

  handleMouseLeave = e => {
    this.setState({ hovered: null });
  };

  handleClick = e => {
    const CLICKED_TERR = e.target.id;
    // UNIT_IN_TERR will return the abbreviation if there is a unit there
    const UNIT_IN_TERR = this.props.units[CLICKED_TERR];
    const SELECTED_UNIT = this.props.units[this.state.selected];
    const LAND_NEIGHBORS = territoriesData[CLICKED_TERR].landNeighbors;
    const SEA_NEIGHBORS = territoriesData[CLICKED_TERR].seaNeighbors;

    if (UNIT_IN_TERR && this.state.selected === null) {
      // Case 1: Territory has a unit in it and no unit is currently selected.
      let { potentialMoves, coastOptions } = findPotentialMoves({
        unit: UNIT_IN_TERR,
        landNeighbors: LAND_NEIGHBORS,
        seaNeighbors: SEA_NEIGHBORS,
        unitsList: this.props.units
      });
      this.setState({
        selected: CLICKED_TERR,
        potentialMoves,
        coastOptions
      });
    } else if (UNIT_IN_TERR && this.state.selected === CLICKED_TERR) {
      // Case 2: Territory has a unit and is the same as the currently selected (HOLD)
      this.props.createOrder({
        fromTerr: CLICKED_TERR,
        toTerr: CLICKED_TERR,
        country: UNIT_IN_TERR.country,
        orderType: 'Hold',
        coast: UNIT_IN_TERR.coast
      });
      this.resetState();
    } else if (
      this.state.potentialMoves.includes(CLICKED_TERR) &&
      this.state.selected !== null
    ) {
      // Case 3: A unit is selected and a potential move is pressed (MOVE)
      let coast = determineCoast({
        coastOps: this.state.coastOptions[CLICKED_TERR]
      });
      if (coast !== -1) {
        this.props.createOrder({
          fromTerr: this.state.selected,
          toTerr: CLICKED_TERR,
          country: SELECTED_UNIT.country,
          orderType: 'Move',
          coast
        });
      } else {
        // Save data into temporary storage and raise modal TODO
        this.setState({
          tmpMoveStorage: {
            fromTerr: this.state.selected,
            toTerr: CLICKED_TERR,
            country: SELECTED_UNIT.country,
            orderType: 'Move'
          },
          chooseCoastModal: true
        });
        return;
      }
      this.resetState();
    } else {
      this.resetState();
    }
  };

  // Determines the className (and thus the coloring) of the territory <path>s
  determineTerrClass = abbreviation => {
    let result = '';
    // check if territory is owned
    if (this.props.territories[abbreviation] !== undefined) {
      result += countriesData[this.props.territories[abbreviation]].posessive;
    }
    // check if territory is selected
    if (abbreviation === this.state.selected) {
      result += ' selected';
    }
    // check if territory is potential move
    if (this.state.potentialMoves.includes(abbreviation)) {
      result += ' potential';
    }
    return result;
  };

  render() {
    return (
      <div className="board">
        <Container>
          <BoardMap
            determineTerrClass={this.determineTerrClass}
            handleClick={this.handleClick}
            handleMouseEnter={this.handleMouseEnter}
            handleMouseLeave={this.handleMouseLeave}
            hovered={this.state.hovered}
          >
            {mapUnits({
              units: this.props.units,
              territories: territoriesData
            })}
          </BoardMap>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  territories: state.territories,
  units: state.units
});

export default connect(mapStateToProps, { createOrder })(Board);

BoardMap.propTypes = {
  territories: PropTypes.object,
  units: PropTypes.object
};
