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
    fromTerr: context.state.selectedUnit.territory,
    country: context.state.selectedUnit.country,
    orderType: 'Hold',
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
      fromTerr: context.state.selectedUnit.territory,
      toTerr: clickedTerr,
      country: context.state.selectedUnit.country,
      orderType: 'Move',
      coast
    });
  } else {
    // Save data into temporary storage and raise modal
    context.setState({
      tmpMoveStorage: {
        fromTerr: context.state.selectedUnit.territory,
        toTerr: clickedTerr,
        country: context.state.selectedUnit.country,
        orderType: 'Move'
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
    fromTerr: context.state.selectedUnit.territory,
    country: context.state.selectedUnit.country,
    orderType: 'Support',
    coast: context.state.selectedUnit.coast,
    auxFromTerr: context.state.supportedUnit.territory,
    auxCountry: context.state.supportedUnit.country,
    auxOrderType: 'Hold'
  });
  context.resetState();
}

export function moveSupportedUnit({ clickedTerr, context }) {
  context.props.createOrder({
    fromTerr: context.state.selectedUnit.territory,
    country: context.state.selectedUnit.country,
    orderType: 'Support',
    coast: context.state.selectedUnit.coast,
    auxFromTerr: context.state.supportedUnit.territory,
    auxToTerr: clickedTerr,
    auxCountry: context.state.supportedUnit.country,
    auxOrderType: 'Move'
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
    fromTerr: context.state.selectedUnit.territory,
    toTerr: clickedTerr,
    country: context.state.selectedUnit.country,
    orderType: 'Move',
    coast: null
  });
  for (let convoyer of context.state.convoyeurs) {
    context.props.createOrder({
      fromTerr: convoyer.territory,
      country: convoyer.country,
      orderType: 'Convoy',
      coast: null,
      auxFromTerr: context.state.selectedUnit.territory,
      auxToTerr: clickedTerr,
      auxCountry: context.state.selectedUnit.country,
      auxOrderType: 'Move'
    });
  }
  context.resetState();
}
