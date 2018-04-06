import React from 'react';
import Army from './army/Army';
import Fleet from './fleet/Fleet';
import * as selectionTypes from './selectionTypes';

export function findPotentialMoves({
  unit,
  landNeighbors,
  seaNeighbors,
  unitsList
}) {
  let potentialMoves = [];
  let coastOptions = {};
  // Valid moves for armies include land neighbors and any sea territories
  // with fleets.
  if (unit.type === 'army') {
    potentialMoves = potentialMoves.concat(landNeighbors);
    if (seaNeighbors !== null) {
      for (let key of Object.keys(seaNeighbors)) {
        potentialMoves = potentialMoves.concat(
          seaNeighbors[key].filter(terr => unitsList[terr] !== undefined)
        );
      }
    }
    // Valid moves for fleets are dependent on their coast. Will need to
    // handle cases for territories with multiple coasts.
  } else if (unit.type === 'fleet') {
    if (unit.coast) {
      potentialMoves = potentialMoves.concat(seaNeighbors[unit.coast]);
    } else {
      potentialMoves = potentialMoves.concat(seaNeighbors.all);
    }
  }
  // This is where we'll handle any coast information
  potentialMoves = potentialMoves.map(terr => {
    if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
      const SPLIT = terr.split('_');
      const TERR = SPLIT[0];
      const COAST = SPLIT[1];
      // Some territories might have multiple coast options. If a coast has already
      // been found, add that coast to coast options but return undefined (since
      // the territory is already in the list)
      if (coastOptions[TERR] === undefined) {
        coastOptions[TERR] = [COAST];
        return TERR;
      } else {
        coastOptions[TERR].push(COAST);
        return null;
      }
    }
    return terr;
  });
  return { potentialMoves, coastOptions };
}

export function determineCoast({ coastOps }) {
  let coast = null;
  if (
    // There is only one coast option
    coastOps !== undefined &&
    coastOps.length === 1
  ) {
    coast = coastOps[0];
  } else if (
    // There is more than one coast option
    coastOps !== undefined &&
    coastOps.length > 1
  ) {
    // This denotes the need for a prompt
    return -1;
  }
  return coast;
}

// This function creates a list of components for all the units in state
export function mapUnits({ units, territories }) {
  return Object.keys(units).map(terr => {
    const UNIT = units[terr];
    const COORDS = territories[terr].coordinates;
    if (UNIT.type === 'army') {
      return (
        <Army
          key={terr}
          owner={UNIT.country}
          x={COORDS.main.x}
          y={COORDS.main.y}
        />
      );
    } else if (UNIT.type === 'fleet') {
      const COAST = UNIT.coast === null ? 'main' : UNIT.coast;
      return (
        <Fleet
          key={terr}
          owner={UNIT.country}
          x={COORDS[COAST].x}
          y={COORDS[COAST].y}
        />
      );
    }
    return null;
  });
}

// This function determines the type of action that should occur when
// a territory is clicked.
export function discernSelectionType({
  state,
  units,
  clickedTerr,
  clickedUnit
}) {
  if (
    clickedUnit !== undefined &&
    state.selectedUnit === null &&
    !state.supportMode
  ) {
    return selectionTypes.SELECT_UNIT;
  } else if (
    state.selectedUnit.territory === clickedTerr &&
    !state.supportMode
  ) {
    return selectionTypes.HOLD_UNIT;
  } else if (state.potentialMoves.includes(clickedTerr) && !state.supportMode) {
    return selectionTypes.MOVE_UNIT;
  } else if (
    clickedUnit !== undefined &&
    state.selectedUnit === null &&
    state.supportMode
  ) {
    return selectionTypes.SELECT_SUPPORTING_UNIT;
  } else if (
    state.potentialMoves.includes(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit === null
  ) {
    return selectionTypes.SELECT_SUPPORTED_UNIT;
  } else if (
    state.potentialMoves.includes(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit !== null &&
    state.supportedUnit.territory === clickedTerr
  ) {
    return selectionTypes.HOLD_SUPPORTED_UNIT;
  } else if (
    state.potentialMoves.includes(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit !== null &&
    state.supportedUnit.territory !== clickedTerr
  ) {
    return selectionTypes.MOVE_SUPPORTED_UNIT;
  }
}
