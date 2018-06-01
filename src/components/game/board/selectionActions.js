import {
  determineCoast,
  findPotentialConvoys,
  findPotentialMoves,
  findPotentialSupports,
  findPotentialSupportedMoves,
  findPotentialConvoyPaths
} from './boardUtils';
import territoriesData from '../../../utils/territories.json';

export function selectUnit({ clickedUnit, context }) {
  let { potentialMoves, coastOptions } = findPotentialMoves({
    unit: clickedUnit
  });
  context.setState({
    selectedUnit: clickedUnit,
    potentialMoves,
    coastOptions,
    infoText: 'Select where you want to move the unit.'
  });
}

export function holdUnit({ context }) {
  context.props.createOrder({
    unitId: context.state.selectedUnit.id,
    unitType: context.state.selectedUnit.unitType,
    country: context.state.selectedUnit.country,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    orderType: 'hold',
    coast: context.state.selectedUnit.coast
  });
  context.resetState();
}

export function moveUnit({ clickedTerr, context }) {
  let coast = determineCoast({
    coastOps: context.state.coastOptions[clickedTerr]
  });
  if (coast !== -1) {
    context.props.createOrder({
      unitId: context.state.selectedUnit.id,
      unitType: context.state.selectedUnit.unitType,
      country: context.state.selectedUnit.country,
      origin: context.state.selectedUnit.territory,
      destination: clickedTerr,
      orderType: 'move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    context.setState({
      tmpMoveStorage: {
        unitId: context.state.selectedUnit.id,
        country: context.state.selectedUnit.country,
        origin: context.state.selectedUnit.territory,
        destination: clickedTerr,
        orderType: 'move'
      },
      chooseCoastModal: true
    });
    return;
  }
  context.resetState();
}

export function selectSupportingUnit({ clickedUnit, context }) {
  const POTENTIAL_SUPPORTS = findPotentialSupports({
    unit: clickedUnit,
    unitsList: context.props.units
  });
  context.setState({
    selectedUnit: clickedUnit,
    potentialMoves: POTENTIAL_SUPPORTS,
    infoText: 'Select which unit to give support to.'
  });
}

export function selectSupportedUnit({ clickedUnit, context }) {
  // find moves they have in common
  const COMMON = findPotentialSupportedMoves({
    selectedUnit: context.state.selectedUnit,
    supportedUnit: clickedUnit,
    unitsList: context.props.units
  });
  context.setState({
    supportedUnit: clickedUnit,
    potentialMoves: COMMON,
    infoText: 'Select where the supported unit will move.'
  });
}

export function holdSupportedUnit({ context }) {
  context.props.createOrder({
    unitId: context.state.selectedUnit.id,
    unitType: context.state.selectedUnit.unitType,
    country: context.state.selectedUnit.country,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    orderType: 'support',
    coast: context.state.selectedUnit.coast,
    auxUnitId: context.state.supportedUnit.id,
    auxUnitType: context.state.supportedUnit.unitType,
    auxCountry: context.state.supportedUnit.country,
    auxOrigin: context.state.supportedUnit.territory,
    auxDestination: context.state.supportedUnit.territory,
    auxOrderType: 'hold'
  });
  context.resetState();
}

export function moveSupportedUnit({ clickedTerr, context }) {
  context.props.createOrder({
    unitId: context.state.selectedUnit.id,
    unitType: context.state.selectedUnit.unitType,
    country: context.state.selectedUnit.country,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    orderType: 'support',
    coast: context.state.selectedUnit.coast,
    auxUnitId: context.state.supportedUnit.id,
    auxUnitType: context.state.supportedUnit.unitType,
    auxCountry: context.state.supportedUnit.country,
    auxOrigin: context.state.supportedUnit.territory,
    auxDestination: clickedTerr,
    auxOrderType: 'move'
  });
  context.resetState();
}

export function selectConvoyedUnit({ clickedUnit, context }) {
  const POTENTIAL_CONVOYS = findPotentialConvoys({
    unit: clickedUnit,
    unitsList: context.props.units
  });
  if (POTENTIAL_CONVOYS.size > 0) {
    context.setState({
      selectedUnit: clickedUnit,
      potentialMoves: POTENTIAL_CONVOYS,
      infoText: 'Select which fleet will begin the convoy.'
    });
  } else {
    context.resetState();
  }
}

export function selectConvoyPath({ clickedUnit, context }) {
  const POTENTIAL_PATHS = findPotentialConvoyPaths({
    unit: clickedUnit,
    unitsList: context.props.units,
    selectedUnit: context.state.selectedUnit,
    convoyeurs: context.state.convoyeurs
  });
  context.setState({
    potentialMoves: POTENTIAL_PATHS,
    convoyeurs: new Set([...context.state.convoyeurs, clickedUnit]),
    infoText:
      'Select another fleet to continue the convoy or a valid coastal territory for the destination.'
  });
}

export function selectConvoyDestination({ clickedTerr, context }) {
  context.props.createOrder({
    unitId: context.state.selectedUnit.id,
    unitType: context.state.selectedUnit.unitType,
    country: context.state.selectedUnit.country,
    origin: context.state.selectedUnit.territory,
    destination: clickedTerr,
    orderType: 'move',
    coast: '',
    viaConvoy: true
  });
  for (let convoyer of context.state.convoyeurs) {
    context.props.createOrder({
      unitId: convoyer.id,
      unitType: convoyer.unitType,
      country: convoyer.country,
      origin: convoyer.territory,
      destination: convoyer.territory,
      orderType: 'convoy',
      coast: '',
      auxUnitId: context.state.selectedUnit.id,
      auxUnitType: context.state.selectedUnit.unitType,
      auxCountry: context.state.selectedUnit.country,
      auxOrigin: context.state.selectedUnit.territory,
      auxDestination: clickedTerr,
      auxOrderType: 'move'
    });
  }
  context.props.createConvoyRoute({
    unitId: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    destination: clickedTerr,
    route: [...context.state.convoyeurs]
  });
  context.resetState();
}

export function addUnit({ clickedTerr, context }) {
  if (territoriesData[clickedTerr].type === 'coastal') {
    context.setState({
      tmpMoveStorage: {
        orderType: 'create',
        country: context.props.territories[clickedTerr].owner,
        territory: clickedTerr
      },
      createUnitModal: true
    });
    return;
  } else {
    context.props.createUnit({
      orderType: 'create',
      unitType: 'army',
      country: context.props.territories[clickedTerr].owner,
      territory: clickedTerr,
      coast: ''
    });
  }
}

export function deleteUnit({ clickedUnit, context }) {
  context.props.deleteUnit({
    orderType: 'delete',
    unitId: clickedUnit.id,
    unitType: clickedUnit.unitType,
    country: clickedUnit.country,
    territory: clickedUnit.territory
  });
}

export function selectDisplacedUnit({ clickedUnit, context }) {
  let { potentialMoves, coastOptions } = findPotentialMoves({
    unit: clickedUnit,
    displaced: true,
    unitsList: context.props.units
  });
  // Remove invadedFrom from potential moves
  const invadedFrom =
    context.props.retreatingUnits[clickedUnit.retreatingFrom].invadedFrom;
  potentialMoves.delete(invadedFrom);
  context.setState({
    selectedUnit: clickedUnit,
    potentialMoves,
    coastOptions,
    infoText: 'Select where you want to move the unit.'
  });
}

export function moveDisplacedUnit({ clickedTerr, context }) {
  let coast = determineCoast({
    coastOps: context.state.coastOptions[clickedTerr]
  });
  if (coast !== -1) {
    context.props.createOrder({
      unitId: context.state.selectedUnit.id,
      unitType: context.state.selectedUnit.unitType,
      origin: context.state.selectedUnit.retreatingFrom,
      destination: clickedTerr,
      country: context.state.selectedUnit.country,
      orderType: 'move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    context.setState({
      tmpMoveStorage: {
        unitId: context.state.selectedUnit.id,
        origin: context.state.selectedUnit.retreatingFrom,
        destination: clickedTerr,
        country: context.state.selectedUnit.country,
        orderType: 'move'
      },
      chooseCoastModal: true
    });
    return;
  }
  context.resetState();
}

export function deleteDisplacedUnit({ clickedUnit, context }) {
  context.props.deleteUnit({
    orderType: 'delete',
    unitId: clickedUnit.id,
    unitType: clickedUnit.unitType,
    country: clickedUnit.country,
    territory: clickedUnit.retreatingFrom,
    displaced: true
  });
  context.resetState();
}
