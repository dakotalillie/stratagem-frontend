import {
  determineCoast,
  findPotentialConvoys,
  findPotentialMoves,
  findPotentialSupports,
  findPotentialSupportedMoves,
  findPotentialConvoyPaths
} from './boardUtils';
import * as selectionTypes from './selectionTypes';
import territoriesData from '../../../utils/territories.json';

export default function dispatchSelectionAction(
  selectionType, clickedTerr, clickedUnit
) {
  switch (selectionType) {
    case selectionTypes.SELECT_UNIT:
      selectUnit.call(this, clickedUnit)
      break;
    case selectionTypes.HOLD_UNIT:
      holdUnit.call(this);
      break;
    case selectionTypes.MOVE_UNIT:
      moveUnit.call(this, clickedTerr);
      break;
    case selectionTypes.SELECT_SUPPORTING_UNIT:
      selectSupportingUnit.call(this, clickedUnit)
      break;
    case selectionTypes.SELECT_SUPPORTED_UNIT:
      selectSupportedUnit.call(this, clickedUnit)
      break;
    case selectionTypes.HOLD_SUPPORTED_UNIT:
      holdSupportedUnit.call(this);
      break;
    case selectionTypes.MOVE_SUPPORTED_UNIT:
      moveSupportedUnit.call(this, clickedTerr);
      break;
    case selectionTypes.SELECT_CONVOYED_UNIT:
      selectConvoyedUnit.call(this, clickedUnit)
      break;
    case selectionTypes.SELECT_CONVOY_PATH:
      selectConvoyPath.call(this, clickedUnit)
      break;
    case selectionTypes.SELECT_CONVOY_DESTINATION:
      selectConvoyDestination.call(this, clickedTerr);
      break;
    case selectionTypes.ADD_UNIT:
      addUnit.call(this, clickedTerr);;
      break;
    case selectionTypes.DELETE_UNIT:
      deleteUnit.call(this, clickedUnit)
      break;
    case selectionTypes.SELECT_DISPLACED_UNIT:
      selectDisplacedUnit.call(this, clickedUnit)
      break;
    case selectionTypes.MOVE_DISPLACED_UNIT:
      moveDisplacedUnit.call(this, clickedTerr);
      break;
    case selectionTypes.DELETE_DISPLACED_UNIT:
      deleteDisplacedUnit.call(this, clickedUnit)
      break;
    default:
      this.resetState();
  }
}

export function retainSelectedUnitWhenChangingMode(mode, selectedUnit) {
  switch (mode) {
    case 'normal':
      selectUnit.call(this, selectedUnit);
      break;
    case 'support':
      selectSupportingUnit.call(this, selectedUnit);
      break;
    case 'convoy':
      if (selectedUnit.type === 'army') {
        selectConvoyedUnit.call(this, selectedUnit);
      } else {
        this.resetState();
      }
      break;
    default:
      this.resetState();
  }
}

function selectUnit(clickedUnit) {
  let { potentialMoves, coastOptions } = findPotentialMoves({
    unit: clickedUnit
  });
  this.setState({
    selectedUnit: clickedUnit,
    potentialMoves,
    coastOptions,
    infoText: 'Select where you want to move the unit.'
  });
}

function holdUnit() {
  this.props.createOrder({
    unitId: this.state.selectedUnit.id,
    unitType: this.state.selectedUnit.unitType,
    country: this.state.selectedUnit.country,
    origin: this.state.selectedUnit.territory,
    destination: this.state.selectedUnit.territory,
    orderType: 'hold',
    coast: this.state.selectedUnit.coast
  });
  this.resetState();
}

function moveUnit(clickedTerr) {
  let coast = determineCoast({
    coastOps: this.state.coastOptions[clickedTerr]
  });
  if (coast !== -1) {
    this.props.createOrder({
      unitId: this.state.selectedUnit.id,
      unitType: this.state.selectedUnit.unitType,
      country: this.state.selectedUnit.country,
      origin: this.state.selectedUnit.territory,
      destination: clickedTerr,
      orderType: 'move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    this.setState({
      tmpMoveStorage: {
        unitId: this.state.selectedUnit.id,
        country: this.state.selectedUnit.country,
        origin: this.state.selectedUnit.territory,
        destination: clickedTerr,
        orderType: 'move'
      },
      chooseCoastModal: true
    });
    return;
  }
  this.resetState();
}

function selectSupportingUnit(clickedUnit) {
  const POTENTIAL_SUPPORTS = findPotentialSupports({
    unit: clickedUnit,
    unitsList: this.props.units
  });
  this.setState({
    selectedUnit: clickedUnit,
    potentialMoves: POTENTIAL_SUPPORTS,
    infoText: 'Select which unit to give support to.'
  });
}

function selectSupportedUnit(clickedUnit) {
  // find moves they have in common
  const COMMON = findPotentialSupportedMoves({
    selectedUnit: this.state.selectedUnit,
    supportedUnit: clickedUnit,
    unitsList: this.props.units
  });
  this.setState({
    supportedUnit: clickedUnit,
    potentialMoves: COMMON,
    infoText: 'Select where the supported unit will move.'
  });
}

function holdSupportedUnit() {
  this.props.createOrder({
    unitId: this.state.selectedUnit.id,
    unitType: this.state.selectedUnit.unitType,
    country: this.state.selectedUnit.country,
    origin: this.state.selectedUnit.territory,
    destination: this.state.selectedUnit.territory,
    orderType: 'support',
    coast: this.state.selectedUnit.coast,
    auxUnitId: this.state.supportedUnit.id,
    auxUnitType: this.state.supportedUnit.unitType,
    auxCountry: this.state.supportedUnit.country,
    auxOrigin: this.state.supportedUnit.territory,
    auxDestination: this.state.supportedUnit.territory,
    auxOrderType: 'hold'
  });
  this.resetState();
}

function moveSupportedUnit(clickedTerr) {
  this.props.createOrder({
    unitId: this.state.selectedUnit.id,
    unitType: this.state.selectedUnit.unitType,
    country: this.state.selectedUnit.country,
    origin: this.state.selectedUnit.territory,
    destination: this.state.selectedUnit.territory,
    orderType: 'support',
    coast: this.state.selectedUnit.coast,
    auxUnitId: this.state.supportedUnit.id,
    auxUnitType: this.state.supportedUnit.unitType,
    auxCountry: this.state.supportedUnit.country,
    auxOrigin: this.state.supportedUnit.territory,
    auxDestination: clickedTerr,
    auxOrderType: 'move'
  });
  this.resetState();
}

function selectConvoyedUnit(clickedUnit) {
  const POTENTIAL_CONVOYS = findPotentialConvoys({
    unit: clickedUnit,
    unitsList: this.props.units
  });
  if (POTENTIAL_CONVOYS.size > 0) {
    this.setState({
      selectedUnit: clickedUnit,
      potentialMoves: POTENTIAL_CONVOYS,
      infoText: 'Select which fleet will begin the convoy.'
    });
  } else {
    this.resetState();
  }
}

function selectConvoyPath(clickedUnit) {
  const POTENTIAL_PATHS = findPotentialConvoyPaths({
    unit: clickedUnit,
    unitsList: this.props.units,
    selectedUnit: this.state.selectedUnit,
    convoyeurs: this.state.convoyeurs
  });
  this.setState({
    potentialMoves: POTENTIAL_PATHS,
    convoyeurs: new Set([...this.state.convoyeurs, clickedUnit]),
    infoText:
      'Select another fleet to continue the convoy or a valid coastal territory for the destination.'
  });
}

function selectConvoyDestination(clickedTerr) {
  this.props.createOrder({
    unitId: this.state.selectedUnit.id,
    unitType: this.state.selectedUnit.unitType,
    country: this.state.selectedUnit.country,
    origin: this.state.selectedUnit.territory,
    destination: clickedTerr,
    orderType: 'move',
    coast: '',
    viaConvoy: true
  });
  for (let convoyer of this.state.convoyeurs) {
    this.props.createOrder({
      unitId: convoyer.id,
      unitType: convoyer.unitType,
      country: convoyer.country,
      origin: convoyer.territory,
      destination: convoyer.territory,
      orderType: 'convoy',
      coast: '',
      auxUnitId: this.state.selectedUnit.id,
      auxUnitType: this.state.selectedUnit.unitType,
      auxCountry: this.state.selectedUnit.country,
      auxOrigin: this.state.selectedUnit.territory,
      auxDestination: clickedTerr,
      auxOrderType: 'move'
    });
  }
  this.props.createConvoyRoute({
    unitId: this.state.selectedUnit.id,
    origin: this.state.selectedUnit.territory,
    destination: clickedTerr,
    route: [...this.state.convoyeurs]
  });
  this.resetState();
}

function addUnit(clickedTerr) {
  if (territoriesData[clickedTerr].type === 'coastal') {
    this.setState({
      tmpMoveStorage: {
        orderType: 'create',
        country: this.props.territories[clickedTerr].owner,
        territory: clickedTerr
      },
      createUnitModal: true
    });
    return;
  } else {
    this.props.createUnit({
      orderType: 'create',
      unitType: 'army',
      country: this.props.territories[clickedTerr].owner,
      territory: clickedTerr,
      coast: ''
    });
  }
}

function deleteUnit(clickedUnit) {
  this.props.deleteUnit({
    orderType: 'delete',
    unitId: clickedUnit.id,
    unitType: clickedUnit.unitType,
    country: clickedUnit.country,
    territory: clickedUnit.territory
  });
}

function selectDisplacedUnit(clickedUnit) {
  let { potentialMoves, coastOptions } = findPotentialMoves({
    unit: clickedUnit,
    displaced: true,
    unitsList: this.props.units
  });
  // Remove invadedFrom from potential moves
  const invadedFrom =
    this.props.retreatingUnits[clickedUnit.retreatingFrom].invadedFrom;
  potentialMoves.delete(invadedFrom);
  this.setState({
    selectedUnit: clickedUnit,
    potentialMoves,
    coastOptions,
    infoText: 'Select where you want to move the unit.'
  });
}

function moveDisplacedUnit(clickedTerr) {
  let coast = determineCoast({
    coastOps: this.state.coastOptions[clickedTerr]
  });
  if (coast !== -1) {
    this.props.createOrder({
      unitId: this.state.selectedUnit.id,
      unitType: this.state.selectedUnit.unitType,
      origin: this.state.selectedUnit.retreatingFrom,
      destination: clickedTerr,
      country: this.state.selectedUnit.country,
      orderType: 'move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    this.setState({
      tmpMoveStorage: {
        unitId: this.state.selectedUnit.id,
        origin: this.state.selectedUnit.retreatingFrom,
        destination: clickedTerr,
        country: this.state.selectedUnit.country,
        orderType: 'move'
      },
      chooseCoastModal: true
    });
    return;
  }
  this.resetState();
}

function deleteDisplacedUnit(clickedUnit) {
  this.props.deleteUnit({
    orderType: 'delete',
    unitId: clickedUnit.id,
    unitType: clickedUnit.unitType,
    country: clickedUnit.country,
    territory: clickedUnit.retreatingFrom,
    displaced: true
  });
  this.resetState();
}
