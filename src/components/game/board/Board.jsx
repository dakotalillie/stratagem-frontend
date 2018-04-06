import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { createOrder } from '../../../actions';
import BoardMap from './boardMap/BoardMap';
import ChooseCoastModal from './chooseCoastModal/ChooseCoastModal';
import {
  discernSelectionType,
  findPotentialMoves,
  determineCoast,
  mapUnits
} from './boardUtils';
import * as selectionTypes from './selectionTypes';
import territoriesData from '../../../utils/territories.json';
import countriesData from '../../../utils/countries.json';
import './board.css';

class Board extends React.Component {
  state = {
    hovered: null,
    selectedUnit: null,
    supportedUnit: null,
    potentialMoves: [],
    coastOptions: {},
    supportMode: false,
    convoyMode: false,
    tmpMoveStorage: {},
    chooseCoastModal: false
  };

  resetState = () => {
    this.setState({
      selectedUnit: null,
      supportedUnit: null,
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
    const UNIT_IN_TERR = this.props.units[CLICKED_TERR];
    const LAND_NEIGHBORS = territoriesData[CLICKED_TERR].landNeighbors;
    const SEA_NEIGHBORS = territoriesData[CLICKED_TERR].seaNeighbors;
    const SELECTION_TYPE = discernSelectionType({
      state: this.state,
      units: this.props.units,
      clickedTerr: CLICKED_TERR,
      clickedUnit: UNIT_IN_TERR
    });

    switch (SELECTION_TYPE) {
      // select unit
      case selectionTypes.SELECT_UNIT:
        let { potentialMoves, coastOptions } = findPotentialMoves({
          unit: UNIT_IN_TERR,
          landNeighbors: LAND_NEIGHBORS,
          seaNeighbors: SEA_NEIGHBORS,
          unitsList: this.props.units
        });
        this.setState({
          selectedUnit: UNIT_IN_TERR,
          potentialMoves,
          coastOptions
        });
        break;
      // hold unit
      case selectionTypes.HOLD_UNIT:
        this.props.createOrder({
          fromTerr: CLICKED_TERR,
          toTerr: CLICKED_TERR,
          country: UNIT_IN_TERR.country,
          orderType: 'Hold',
          coast: UNIT_IN_TERR.coast
        });
        this.resetState();
        break;
      // move unit
      case selectionTypes.MOVE_UNIT:
        let coast = determineCoast({
          coastOps: this.state.coastOptions[CLICKED_TERR]
        });
        if (coast !== -1) {
          this.props.createOrder({
            fromTerr: this.state.selectedUnit.territory,
            toTerr: CLICKED_TERR,
            country: this.state.selectedUnit.country,
            orderType: 'Move',
            coast
          });
        } else {
          // Save data into temporary storage and raise modal
          this.setState({
            tmpMoveStorage: {
              fromTerr: this.state.selectedUnit.territory,
              toTerr: CLICKED_TERR,
              country: this.state.selectedUnit.country,
              orderType: 'Move'
            },
            chooseCoastModal: true
          });
          return;
        }
        this.resetState();
        break;
      // selected supporting unit

      default:
        this.resetState();
    }
  };

  selectCoast = coast => {
    this.props.createOrder({
      ...this.state.tmpMoveStorage,
      coast
    });
    this.resetState();
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
    const COASTS_FOR_MODAL = this.state.coastOptions[
      this.state.tmpMoveStorage.toTerr
    ];

    return (
      <div className="board">
        <Container>
          <div className="board-map">
            {this.state.chooseCoastModal ? (
              <ChooseCoastModal
                coasts={COASTS_FOR_MODAL}
                selectCoast={this.selectCoast}
              />
            ) : null}
            <BoardMap
              chooseCoastModal={this.state.chooseCoastModal}
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
          </div>
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
