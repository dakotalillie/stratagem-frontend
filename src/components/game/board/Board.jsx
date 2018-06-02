import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';

import BoardHeader from './boardHeader/BoardHeader';
import BoardMap from './boardMap/BoardMap';
import BoardFooter from './boardFooter/BoardFooter';
import ChooseCoastModal from './chooseCoastModal/ChooseCoastModal';
import CreateUnitModal from './createUnitModal/CreateUnitModal';

import {
  mapUnits, mapRetreatingUnits, getDisplacedUnitsForPlayer,
  findPotentialAdditionsAndDeletions, buildClassNameFromAttributes
} from './boardUtils';
import discernSelectionType from './selectionTypes';
import dispatchSelectionAction, {
  retainSelectedUnitWhenChangingMode
} from './selectionActions';
import {
  createOrder, createConvoyRoute, createUnit, deleteUnit
} from '../../../actions';
import CustomPropTypes from '../../../utils/customPropTypes'
import './board.css';

class Board extends React.Component {

  static propTypes = {
    currentUser: CustomPropTypes.currentUser.isRequired,
    currentTurn: CustomPropTypes.currentTurn,
    countries: CustomPropTypes.countries.isRequired,
    territories: CustomPropTypes.territories.isRequired,
    units: PropTypes.objectOf(CustomPropTypes.unit).isRequired,
    retreatingUnits: PropTypes.objectOf(CustomPropTypes.unit).isRequired,
    createOrder: PropTypes.func.isRequired,
    createConvoyRoute: PropTypes.func.isRequired,
    createUnit: PropTypes.func.isRequired,
    deleteUnit: PropTypes.func.isRequired,
    toggleGameInfoModal: PropTypes.func.isRequired,
  };

  state = {
    hovered: null,
    selectedUnit: null,
    supportedUnit: null,
    convoyeurs: new Set(),
    potentialMoves: new Set(),
    coastOptions: {},
    mode: 'normal',
    tmpMoveStorage: {},
    chooseCoastModal: false,
    addUnitModal: false,
    potentialAdditions: [],
    potentialDeletions: [],
    displacedUnits: [],
    infoText: '',
  };

  static getDerivedStateFromProps = nextProps => {
    const nextPhase = nextProps.currentTurn.phase;
    if (nextPhase === 'diplomatic') {
      return {
        potentialAdditions: [],
        potentialDeletions: [],
        displacedUnits: []
      };
    } else if (nextPhase === 'retreat') {
      return getDisplacedUnitsForPlayer(nextProps);
    } else if (nextPhase === 'reinforcement') {
      return findPotentialAdditionsAndDeletions(nextProps);
    }
    return null;
  };

  resetState = () => {
    this.setState({
      selectedUnit: null,
      supportedUnit: null,
      convoyeurs: new Set([]),
      potentialMoves: new Set([]),
      coastOptions: {},
      mode: 'normal',
      tmpMoveStorage: {},
      chooseCoastModal: false,
      createUnitModal: false,
      infoText: 'Select a unit to give orders.'
    });
  };

  handleMouseEnter = e => {
    const territory = this.props.territories[e.target.id];
    if (territory != null) {
      this.setState({ hovered: territory });
    }
  };

  handleMouseLeave = e => {
    this.setState({ hovered: null });
  };

  handleClick = e => {
    const clickedTerr = e.target.id;
    const clickedUnit = this.props.retreatingUnits[clickedTerr]
      ? this.props.retreatingUnits[clickedTerr]
      : this.props.units[clickedTerr];
    const selectionType = discernSelectionType({
      state: this.state,
      units: this.props.units,
      clickedTerr: clickedTerr,
      clickedUnit: clickedUnit,
      phase: this.props.currentTurn.phase
    });
    dispatchSelectionAction.call(this, selectionType, clickedTerr, clickedUnit);
  }

  setMode = mode => {
    const { selectedUnit } = this.state;
    if (mode !== this.state.mode && selectedUnit !== null) {
      retainSelectedUnitWhenChangingMode.call(this, mode, selectedUnit);
    }
    this.setState({ mode });
  };

  selectCoast = coast => {
    this.props.createOrder({
      ...this.state.tmpMoveStorage,
      coast
    });
    this.resetState();
  };

  selectUnitType = (unitType, coast) => {
    this.props.createUnit({
      ...this.state.tmpMoveStorage,
      unitType,
      coast
    });
    this.resetState();
  };

  determineTerrClass = abbreviation => {
    return buildClassNameFromAttributes.call(this, abbreviation);
  };

  render() {
    const { toggleGameInfoModal } = this.props;
    const coastsForModal = this.state.coastOptions[
      this.state.tmpMoveStorage.destination
    ];
    return (
      <div className="board">
        <Container>
          <BoardHeader
            mode={this.state.mode}
            setMode={this.setMode}
            toggleGameInfoModal={toggleGameInfoModal}
          />
          <div className="board-map">
            {this.state.chooseCoastModal && (
              <ChooseCoastModal
                coasts={coastsForModal}
                selectCoast={this.selectCoast}
              />
            )}
            {this.state.createUnitModal && (
              <CreateUnitModal
                selectUnitType={this.selectUnitType}
                multiCoast={this.state.tmpMoveStorage.territory === 'Stp'}
              />
            )}
            <BoardMap
              chooseCoastModal={this.state.chooseCoastModal}
              determineTerrClass={this.determineTerrClass}
              handleClick={this.handleClick}
              handleMouseEnter={this.handleMouseEnter}
              handleMouseLeave={this.handleMouseLeave}
              hovered={this.state.hovered}
            >
              {mapUnits(this.props.units)}
              {mapRetreatingUnits(this.props.retreatingUnits)}
            </BoardMap>
          </div>
          <BoardFooter infoText={this.state.infoText} />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  currentTurn: state.currentTurn,
  countries: state.countries,
  territories: state.territories,
  units: state.units,
  retreatingUnits: state.retreatingUnits,
});

export default connect(mapStateToProps, {
  createOrder,createConvoyRoute, createUnit, deleteUnit
})(Board);
