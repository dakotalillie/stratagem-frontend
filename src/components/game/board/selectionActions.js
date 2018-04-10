import {
  determineCoast,
  findPotentialConvoys,
  findPotentialMoves,
  findPotentialSupports,
  findPotentialSupportedMoves,
  findPotentialConvoyPaths
} from './boardUtils';

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
    order_type: 'Hold',
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
      order_type: 'Move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    context.setState({
      tmpMoveStorage: {
        origin: context.state.selectedUnit.territory,
        destination: clickedTerr,
        order_type: 'Move'
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
    order_type: 'Support',
    coast: context.state.selectedUnit.coast,
    aux_origin: context.state.supportedUnit.territory,
    aux_order_type: 'Hold'
  });
  context.resetState();
}

export function moveSupportedUnit({ clickedTerr, context }) {
  context.props.createOrder({
    unit_id: context.state.selectedUnit.id,
    origin: context.state.selectedUnit.territory,
    order_type: 'Support',
    coast: context.state.selectedUnit.coast,
    aux_origin: context.state.supportedUnit.territory,
    aux_destination: clickedTerr,
    aux_order_type: 'Move'
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
    country: context.state.selectedUnit.country,
    order_type: 'Move',
    coast: ''
  });
  for (let convoyer of context.state.convoyeurs) {
    context.props.createOrder({
      unit_id: convoyer.id,
      origin: convoyer.territory,
      order_type: 'Convoy',
      coast: '',
      aux_origin: context.state.selectedUnit.territory,
      aux_destination: clickedTerr,
      aux_order_type: 'Move'
    });
  }
  context.resetState();
}
