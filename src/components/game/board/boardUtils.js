import React from 'react';
import Army from './army/Army';
import Fleet from './fleet/Fleet';
import * as selectionTypes from './selectionTypes';
import territoriesData from '../../../utils/territories.json';

export function findPotentialMoves({ unit }) {
  let potentialMoves = new Set([]);
  let coastOptions = {};
  const LAND_NEIGHBORS = territoriesData[unit.territory].landNeighbors;
  const SEA_NEIGHBORS = territoriesData[unit.territory].seaNeighbors;

  if (unit.type === 'army') {
    for (let neighbor of LAND_NEIGHBORS) {
      potentialMoves.add(neighbor);
    }
  } else if (unit.type === 'fleet') {
    // Valid moves for fleets are dependent on their coast. Will need to
    // handle cases for territories with multiple coasts.
    if (unit.coast) {
      for (let neighbor of SEA_NEIGHBORS[unit.coast]) {
        potentialMoves.add(neighbor);
      }
    } else {
      for (let neighbor of SEA_NEIGHBORS.all) {
        potentialMoves.add(neighbor);
      }
    }
  }
  // This is where we'll handle any coast information
  potentialMoves = new Set(
    [...potentialMoves].map(terr => {
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
    })
  );
  return { potentialMoves, coastOptions };
}

export function findPotentialSupports({ unit, unitsList }) {
  // First, generate a list of all neighboring territories, making sure to
  // filter out any coast information. Any immediate neighbors with units
  // in them form the inital batch of potential supported units.

  let potentialSupportedUnits = new Set([]);

  const IMMEDIATE_NEIGHBORS = findAllNeighbors(territoriesData[unit.territory]);
  for (let terr of IMMEDIATE_NEIGHBORS) {
    if (unitsList[terr] !== undefined) {
      potentialSupportedUnits.add(terr);
    }
  }

  // Then, find the neighbors of each of those territories (making sure to
  // filter for duplicates).
  const SECOND_DEGREE_NEIGHBORS = new Set([]);
  for (let neighbor of IMMEDIATE_NEIGHBORS) {
    const NEIGHBOR_NEIGHBORS = findAllNeighbors(territoriesData[neighbor]);
    for (let nn of NEIGHBOR_NEIGHBORS) {
      if (nn !== unit.territory) {
        SECOND_DEGREE_NEIGHBORS.add(nn);
      }
    }
  }

  // Then, filter the list of second-degree neighbors to include only territories
  // that have a unit in them.
  const OCCUPIED_SECOND_DEGREE = [...SECOND_DEGREE_NEIGHBORS].filter(terr => {
    return unitsList[terr] !== undefined;
  });

  // Then, make sure that every potentially supported unit's potential
  // moves overlaps with the clicked unit's potential moves
  for (let terr of OCCUPIED_SECOND_DEGREE) {
    const SECOND_UNIT = unitsList[terr];
    if (findCommonMoves({ unit1: unit, unit2: SECOND_UNIT }).size > 0) {
      potentialSupportedUnits.add(terr);
    }
  }

  return potentialSupportedUnits;
}

export function findPotentialConvoys({ unit, unitsList }) {
  const SEA_NEIGHBORS = territoriesData[unit.territory].seaNeighbors;
  let potentialMoves = [];

  for (let key of Object.keys(SEA_NEIGHBORS)) {
    potentialMoves = potentialMoves.concat(
      SEA_NEIGHBORS[key].filter(terr => unitsList[terr] !== undefined)
    );
  }
}

function findAllNeighbors(territory) {
  let neighbors = territory.landNeighbors;
  const SEA_NEIGHBORS = territory.seaNeighbors;
  if (SEA_NEIGHBORS !== null) {
    for (let key of Object.keys(SEA_NEIGHBORS)) {
      const NEIGHBORS_NO_COAST_INFO = SEA_NEIGHBORS[key].map(terr => {
        if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
          const SPLIT = terr.split('_');
          return SPLIT[0];
        }
        return terr;
      });
      neighbors = neighbors.concat(NEIGHBORS_NO_COAST_INFO);
    }
  }
  return neighbors;
}

export function findCommonMoves({ unit1, unit2 }) {
  const UNIT_MOVES = findPotentialMoves({ unit: unit1 }).potentialMoves;
  const SUPPORTED_UNIT_MOVES = findPotentialMoves({
    unit: unit2
  }).potentialMoves;
  const UNION = new Set(
    [...UNIT_MOVES].filter(terr => SUPPORTED_UNIT_MOVES.has(terr))
  );
  return UNION;
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
    state.selectedUnit !== null &&
    state.selectedUnit.territory === clickedTerr &&
    !state.supportMode
  ) {
    return selectionTypes.HOLD_UNIT;
  } else if (state.potentialMoves.has(clickedTerr) && !state.supportMode) {
    return selectionTypes.MOVE_UNIT;
  } else if (
    clickedUnit !== undefined &&
    state.selectedUnit === null &&
    state.supportMode
  ) {
    return selectionTypes.SELECT_SUPPORTING_UNIT;
  } else if (
    state.potentialMoves.has(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit === null
  ) {
    return selectionTypes.SELECT_SUPPORTED_UNIT;
  } else if (
    state.potentialMoves.has(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit !== null &&
    state.supportedUnit.territory === clickedTerr
  ) {
    return selectionTypes.HOLD_SUPPORTED_UNIT;
  } else if (
    state.potentialMoves.has(clickedTerr) &&
    state.supportMode &&
    state.supportedUnit !== null &&
    state.supportedUnit.territory !== clickedTerr
  ) {
    return selectionTypes.MOVE_SUPPORTED_UNIT;
  }
}
