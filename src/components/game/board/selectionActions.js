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
    unit_id: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    order_type: 'hold',
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
      unit_id: context.state.selectedUnit.id,
      origin: context.state.selectedUnit.territory,
      destination: clickedTerr,
      order_type: 'move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    context.setState({
      tmpMoveStorage: {
        origin: context.state.selectedUnit.territory,
        destination: clickedTerr,
        order_type: 'move'
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
    unit_id: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    order_type: 'support',
    coast: context.state.selectedUnit.coast,
    aux_unit_id: context.state.supportedUnit.id,
    aux_origin: context.state.supportedUnit.territory,
    aux_destination: context.state.supportedUnit.territory,
    aux_order_type: 'hold'
  });
  context.resetState();
}

export function moveSupportedUnit({ clickedTerr, context }) {
  context.props.createOrder({
    unit_id: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    destination: context.state.selectedUnit.territory,
    order_type: 'support',
    coast: context.state.selectedUnit.coast,
    aux_unit_id: context.state.supportedUnit.id,
    aux_origin: context.state.supportedUnit.territory,
    aux_destination: clickedTerr,
    aux_order_type: 'move'
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
    unit_id: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    destination: clickedTerr,
    order_type: 'move',
    coast: '',
    via_convoy: true
  });
  for (let convoyer of context.state.convoyeurs) {
    context.props.createOrder({
      unit_id: convoyer.id,
      origin: convoyer.territory,
      destination: convoyer.territory,
      order_type: 'convoy',
      coast: '',
      aux_unit_id: context.state.selectedUnit.id,
      aux_origin: context.state.selectedUnit.territory,
      aux_destination: clickedTerr,
      aux_order_type: 'move'
    });
  }
  context.props.createConvoyRoute({
    unit_id: context.state.selectedUnit.id,
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
        order_type: 'create',
        country: context.props.territories[clickedTerr].owner,
        territory: clickedTerr
      },
      createUnitModal: true
    });
    return;
  } else {
    context.props.createUnit({
      order_type: 'create',
      unit_type: 'army',
      country: context.props.territories[clickedTerr].owner,
      territory: clickedTerr,
      coast: ''
    });
  }
}

export function deleteUnit({ clickedUnit, context }) {
  context.props.deleteUnit({
    order_type: 'delete',
    unit_id: clickedUnit.id,
    country: clickedUnit.country,
    territory: clickedUnit.territory
  });
}
