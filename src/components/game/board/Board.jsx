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
  findPotentialAdditionsAndDeletions
} from './boardUtils';
import discernSelectionType, * as selectionTypes from './selectionTypes';
import * as selectionActions from './selectionActions';
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
    const CLICKED_UNIT = this.props.retreatingUnits[CLICKED_TERR]
      ? this.props.retreatingUnits[CLICKED_TERR]
      : this.props.units[CLICKED_TERR];
    const SELECTION_TYPE = discernSelectionType({
      state: this.state,
      units: this.props.units,
      clickedTerr: CLICKED_TERR,
      clickedUnit: CLICKED_UNIT,
      phase: this.props.currentTurn.phase
    });

    switch (SELECTION_TYPE) {
      case selectionTypes.SELECT_UNIT:
        selectionActions.selectUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.HOLD_UNIT:
        selectionActions.holdUnit({ context: this });
        break;
      case selectionTypes.MOVE_UNIT:
        selectionActions.moveUnit({ clickedTerr: CLICKED_TERR, context: this });
        break;
      case selectionTypes.SELECT_SUPPORTING_UNIT:
        selectionActions.selectSupportingUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.SELECT_SUPPORTED_UNIT:
        selectionActions.selectSupportedUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.HOLD_SUPPORTED_UNIT:
        selectionActions.holdSupportedUnit({
          context: this
        });
        break;
      case selectionTypes.MOVE_SUPPORTED_UNIT:
        selectionActions.moveSupportedUnit({
          clickedTerr: CLICKED_TERR,
          context: this
        });
        break;
      case selectionTypes.SELECT_CONVOYED_UNIT:
        selectionActions.selectConvoyedUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.SELECT_CONVOY_PATH:
        selectionActions.selectConvoyPath({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.SELECT_CONVOY_DESTINATION:
        selectionActions.selectConvoyDestination({
          clickedTerr: CLICKED_TERR,
          context: this
        });
        break;
      case selectionTypes.ADD_UNIT:
        selectionActions.addUnit({
          clickedTerr: CLICKED_TERR,
          context: this
        });
        break;
      case selectionTypes.DELETE_UNIT:
        selectionActions.deleteUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.SELECT_DISPLACED_UNIT:
        selectionActions.selectDisplacedUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      case selectionTypes.MOVE_DISPLACED_UNIT:
        selectionActions.moveDisplacedUnit({
          clickedTerr: CLICKED_TERR,
          context: this
        });
        break;
      case selectionTypes.DELETE_DISPLACED_UNIT:
        selectionActions.deleteDisplacedUnit({
          clickedUnit: CLICKED_UNIT,
          context: this
        });
        break;
      default:
        this.resetState();
    }
  };

  setMode = mode => {
    const SELECTED_UNIT = this.state.selectedUnit;
    if (mode !== this.state.mode && SELECTED_UNIT !== null) {
      switch (mode) {
        case 'normal':
          selectionActions.selectUnit({
            clickedUnit: SELECTED_UNIT,
            context: this
          });
          break;
        case 'support':
          selectionActions.selectSupportingUnit({
            clickedUnit: SELECTED_UNIT,
            context: this
          });
          break;
        case 'convoy':
          if (SELECTED_UNIT.type === 'army') {
            selectionActions.selectConvoyedUnit({
              clickedUnit: SELECTED_UNIT,
              context: this
            });
          } else {
            this.resetState();
          }
          break;
        default:
          this.resetState();
      }
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

  // Determines the className (and thus the coloring) of the territory <path>s
  determineTerrClass = abbreviation => {
    let result = '';
    // check if territory is owned
    if (this.props.territories[abbreviation] !== undefined) {
      result +=
        countriesData[this.props.territories[abbreviation].owner].posessive;
    }
    if (
      this.state.selectedUnit !== null &&
      (abbreviation === this.state.selectedUnit.territory ||
        abbreviation === this.state.selectedUnit.retreatingFrom)
    ) {
      result += ' selected';
    }
    if (
      this.state.supportedUnit !== null &&
      abbreviation === this.state.supportedUnit.territory
    ) {
      result += ' supported';
    }
    if (this.state.potentialMoves.has(abbreviation)) {
      result += ' potential';
    }
    for (let convoyeur of this.state.convoyeurs) {
      if (convoyeur.territory === abbreviation) {
        result += ' convoy';
      }
    }
    if (this.state.potentialAdditions.includes(abbreviation)) {
      result += ' addition';
    }
    if (this.state.potentialDeletions.includes(abbreviation)) {
      result += ' deletion';
    }
    if (this.state.displacedUnits.includes(abbreviation)) {
      if (
        !this.state.selectedUnit ||
        (this.state.selectedUnit &&
          this.state.selectedUnit.retreatingFrom !== abbreviation)
      ) {
        result += ' displaced';
      }
    }
    return result;
  };

  render() {
    const { toggleGameInfoModal } = this.props;
    const COASTS_FOR_MODAL = this.state.coastOptions[
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
                coasts={COASTS_FOR_MODAL}
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
