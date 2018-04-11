import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { createOrder, createConvoyRoute } from '../../../actions';
import BoardHeader from './boardHeader/BoardHeader';
import BoardMap from './boardMap/BoardMap';
import BoardFooter from './boardFooter/BoardFooter';
import ChooseCoastModal from './chooseCoastModal/ChooseCoastModal';
import { mapUnits } from './boardUtils';
import * as selectionTypes from './selectionTypes';
import * as selectionActions from './selectionActions';
import territoriesData from '../../../utils/territories.json';
import countriesData from '../../../utils/countries.json';
import './board.css';

class Board extends React.Component {
  state = {
    hovered: null,
    selectedUnit: null,
    supportedUnit: null,
    convoyeurs: new Set([]),
    potentialMoves: new Set([]),
    coastOptions: {},
    mode: 'normal',
    tmpMoveStorage: {},
    chooseCoastModal: false,
    infoText: 'Select a unit to give orders.'
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
    const CLICKED_UNIT = this.props.units[CLICKED_TERR];
    const SELECTION_TYPE = selectionTypes.discernSelectionType({
      state: this.state,
      units: this.props.units,
      clickedTerr: CLICKED_TERR,
      clickedUnit: CLICKED_UNIT
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
      abbreviation === this.state.selectedUnit.territory
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
    return result;
  };

  render() {
    const COASTS_FOR_MODAL = this.state.coastOptions[
      this.state.tmpMoveStorage.toTerr
    ];
    return (
      <div className="board">
        <Container>
          <BoardHeader mode={this.state.mode} setMode={this.setMode} />
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
          <BoardFooter infoText={this.state.infoText} />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  territories: state.territories,
  units: state.units
});

export default connect(mapStateToProps, { createOrder, createConvoyRoute })(
  Board
);

BoardMap.propTypes = {
  territories: PropTypes.object,
  units: PropTypes.object
};
