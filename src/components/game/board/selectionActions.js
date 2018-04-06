import {
  determineCoast,
  findCommonMoves,
  findPotentialMoves,
  findPotentialSupports
} from './boardUtils';

export function selectUnit({ clickedUnit, context }) {
  let { potentialMoves, coastOptions } = findPotentialMoves({
    unit: clickedUnit
  });
  context.setState({
    selectedUnit: clickedUnit,
    potentialMoves,
    coastOptions
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
    potentialMoves: POTENTIAL_SUPPORTS
  });
}

export function selectSupportedUnit({ clickedUnit, context }) {
  // find moves they have in common
  const COMMON = findCommonMoves({
    unit1: clickedUnit,
    unit2: context.state.selectedUnit
  });
  context.setState({ supportedUnit: clickedUnit, potentialMoves: COMMON });
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
  debugger;
  context.resetState();
}
