import React from 'react';
import Army from './army/Army';
import Fleet from './fleet/Fleet';
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

  // Also expand the list to include units that can travel via convoy. TODO

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
  return findSeaNeighbors({
    unit,
    unitsList,
    occupied: true,
    occupiedType: 'fleet'
  });
}

export function findPotentialConvoyPaths({
  unit,
  unitsList,
  selectedUnit,
  convoyeurs
}) {
  const OCCUPIED_SEA_NEIGHBORS = findSeaNeighbors({
    unit,
    unitsList,
    occupied: true,
    occupiedType: 'fleet'
  });
  const LAND_NEIGHBORS = findLandNeighbors({ unit, unitsList });
  const POTENTIAL_CONVOY_PATHS = new Set([
    ...OCCUPIED_SEA_NEIGHBORS,
    ...LAND_NEIGHBORS
  ]);
  // Make sure the selected unit's territory is not included as an option.
  POTENTIAL_CONVOY_PATHS.delete(selectedUnit.territory);
  // Same with any previously selected convoys
  for (let convoyeur of convoyeurs) {
    if (POTENTIAL_CONVOY_PATHS.has(convoyeur.territory)) {
      POTENTIAL_CONVOY_PATHS.delete(convoyeur.territory);
    }
  }
  return POTENTIAL_CONVOY_PATHS;
}

function findLandNeighbors({ unit, unitsList, occupied }) {
  const LAND_NEIGHBORS = territoriesData[unit.territory].landNeighbors;
  let result = new Set([]);

  for (let terr of LAND_NEIGHBORS) {
    if (occupied) {
      if (unitsList[terr] !== undefined) {
        result.add(terr);
      }
    } else {
      result.add(terr);
    }
  }
  return result;
}

function findSeaNeighbors({ unit, unitsList, occupied, occupiedType }) {
  const SEA_NEIGHBORS = territoriesData[unit.territory].seaNeighbors;
  let result = new Set([]);
  for (let key of Object.keys(SEA_NEIGHBORS)) {
    for (let terr of SEA_NEIGHBORS[key]) {
      if (occupied && occupiedType) {
        if (
          unitsList[terr] !== undefined &&
          unitsList[terr].type === occupiedType
        ) {
          result.add(terr);
        }
      } else if (occupied && !occupiedType) {
        if (unitsList[terr] !== undefined) {
          result.add(terr);
        }
      } else {
        result.add(terr);
      }
    }
  }
  return result;
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
