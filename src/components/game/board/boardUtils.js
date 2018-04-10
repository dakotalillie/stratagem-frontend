import React from 'react';
import Army from './army/Army';
import Fleet from './fleet/Fleet';
import territoriesData from '../../../utils/territories.json';

export function findPotentialMoves({ unit }) {
  let potentialMoves = new Set([]);
  let coastOptions = {};
  const LAND_NEIGHBORS = territoriesData[unit.territory].landNeighbors;
  const SEA_NEIGHBORS = territoriesData[unit.territory].seaNeighbors;

  if (unit.unit_type === 'army') {
    for (let neighbor of LAND_NEIGHBORS) {
      potentialMoves.add(neighbor);
    }
  } else if (unit.unit_type === 'fleet') {
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

  const IMMEDIATE_NEIGHBORS = findNeighbors({ sourceTerr: unit.territory });
  for (let terr of IMMEDIATE_NEIGHBORS) {
    if (unitsList[terr] !== undefined) {
      potentialSupportedUnits.add(terr);
    }
  }

  // Then, find the neighbors of each of those territories (making sure to
  // filter for duplicates).
  const SECOND_DEGREE_NEIGHBORS = new Set([]);
  for (let neighbor of IMMEDIATE_NEIGHBORS) {
    const NEIGHBOR_NEIGHBORS = findNeighbors({
      sourceTerr: neighbor,
      unitsList,
      occupied: true
    });
    for (let nn of NEIGHBOR_NEIGHBORS) {
      if (nn !== unit.territory) {
        SECOND_DEGREE_NEIGHBORS.add(nn);
      }
    }
  }

  // Then, make sure that every potentially supported unit's potential
  // moves overlaps with the clicked unit's potential moves
  for (let terr of SECOND_DEGREE_NEIGHBORS) {
    const SECOND_UNIT = unitsList[terr];
    if (findCommonMoves({ unit1: unit, unit2: SECOND_UNIT }).size > 0) {
      potentialSupportedUnits.add(terr);
    }
  }

  // We also need to find any distant units we could support when they're
  // convoyed to an adjacent territory. First, identify the landing zones.
  const LANDING_ZONES = findPotentialLandingZones({ unit });
  // Then, find occupied water territories next to those landing zones.
  const POTENTIAL_CONVOY_PATH = new Set([]);
  for (let landingZone of LANDING_ZONES) {
    const OCCUPIED_SEA_NEIGHBORS = findNeighbors({
      sourceTerr: landingZone,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    for (let terr of OCCUPIED_SEA_NEIGHBORS) {
      POTENTIAL_CONVOY_PATH.add(terr);
    }
  }
  /*
  Then, start a queue from POTENTIAL_CONVOY_PATH. For each element in the
  queue, identify any neighboring occupied water territories, adding those 
  both to the potential convoy path and the queue. Then, identify any 
  neighboring occupied coastal territories, making sure they don't match
  the supporting unit before adding them to potentialSupportedUnits. Then
  remove the element from the queue
  */
  const CONVOY_CHECK_QUEUE = [...POTENTIAL_CONVOY_PATH];
  while (CONVOY_CHECK_QUEUE.length > 0) {
    const TERR = CONVOY_CHECK_QUEUE.shift();
    const OCCUPIED_WATER_NEIGHBORS = findNeighbors({
      sourceTerr: TERR,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    for (let terr of OCCUPIED_WATER_NEIGHBORS) {
      if (!POTENTIAL_CONVOY_PATH.has(terr)) {
        CONVOY_CHECK_QUEUE.push(terr);
      }
      POTENTIAL_CONVOY_PATH.add(terr);
    }
    const OCCUPIED_COASTAL_NEIGHBORS = findNeighbors({
      sourceTerr: TERR,
      unitsList,
      occupied: true,
      occupiedType: 'army',
      terrType: 'coastal'
    });
    for (let terr of OCCUPIED_COASTAL_NEIGHBORS) {
      if (terr !== unit.territory) {
        potentialSupportedUnits.add(terr);
      }
    }
  }

  return potentialSupportedUnits;
}

export function findPotentialConvoys({ unit, unitsList }) {
  return findNeighbors({
    sourceTerr: unit.territory,
    unitsList,
    occupied: true,
    occupiedType: 'fleet',
    terrType: 'water'
  });
}

export function findPotentialLandingZones({ unit }) {
  // If an army, this consists of finding potential moves that are coastal
  // If a fleet, this consists of finding potential moves that are coastal
  let potentialMoves = new Set([]);
  const LAND_NEIGHBORS = territoriesData[unit.territory].landNeighbors;
  const SEA_NEIGHBORS = territoriesData[unit.territory].seaNeighbors;

  if (unit.unit_type === 'army') {
    for (let neighbor of LAND_NEIGHBORS) {
      potentialMoves.add(neighbor);
    }
  } else if (unit.unit_type === 'fleet') {
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

  // remove coast data, then filter to make sure they're coastal.
  potentialMoves = new Set(
    [...potentialMoves]
      .map(terr => {
        if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
          const SPLIT = terr.split('_');
          return SPLIT[0];
        }
        return terr;
      })
      .filter(terr => territoriesData[terr].type === 'coastal')
  );
  return potentialMoves;
}

export function findPotentialConvoyPaths({
  unit,
  unitsList,
  selectedUnit,
  convoyeurs
}) {
  const OCCUPIED_SEA_NEIGHBORS = findNeighbors({
    sourceTerr: unit.territory,
    unitsList,
    occupied: true,
    occupiedType: 'fleet',
    terrType: 'water'
  });
  const COASTAL_NEIGHBORS = findNeighbors({
    sourceTerr: unit.territory,
    terrType: 'coastal'
  });
  const POTENTIAL_CONVOY_PATHS = new Set([
    ...OCCUPIED_SEA_NEIGHBORS,
    ...COASTAL_NEIGHBORS
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

export function findNeighbors({
  sourceTerr, // the territory whose neighbors you seek
  coast, // get sea neighbors for a specific coast?
  unitsList, // list of units currently on the board
  neighborType, // specify land neighbors or sea neighbors? defaults to all
  occupied, // does the neighbor need to be occupied?
  occupiedType, // if the neighbor is occupied, should the unit be a specific type?
  terrType // should the neighbor be water, coastal, or inland?
}) {
  const NEIGHBORS = new Set([]);
  if (neighborType === undefined || neighborType === 'land') {
    const LAND_NEIGHBORS = territoriesData[sourceTerr].landNeighbors;
    for (let terr of LAND_NEIGHBORS) {
      if (
        terrMatchesCriteria({
          terr,
          unitsList,
          occupied,
          occupiedType,
          terrType
        })
      ) {
        NEIGHBORS.add(terr);
      }
    }
  }
  if (neighborType === undefined || neighborType === 'sea') {
    const SEA_NEIGHBORS = territoriesData[sourceTerr].seaNeighbors;
    if (SEA_NEIGHBORS !== null) {
      for (let key of Object.keys(SEA_NEIGHBORS)) {
        if (coast === undefined || (coast && coast === key)) {
          for (let terrName of SEA_NEIGHBORS[key]) {
            const TERR = splitTerrName({ terr: terrName });
            if (
              terrMatchesCriteria({
                terr: TERR,
                unitsList,
                occupied,
                occupiedType,
                terrType
              })
            ) {
              NEIGHBORS.add(TERR);
            }
          }
        }
      }
    }
  }
  return NEIGHBORS;
}

function terrMatchesCriteria({
  terr,
  unitsList,
  occupied,
  occupiedType,
  terrType
}) {
  if (occupied && unitsList[terr] === undefined) return false;
  if (occupiedType && unitsList[terr].unit_type !== occupiedType) return false;
  if (terrType && territoriesData[terr].type !== terrType) return false;
  return true;
}

function splitTerrName({ terr }) {
  if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
    const SPLIT = terr.split('_');
    return SPLIT[0];
  }
  return terr;
}

export function findPotentialSupportedMoves({
  selectedUnit,
  supportedUnit,
  unitsList
}) {
  const COMMON_MOVES = findCommonMoves({
    unit1: selectedUnit,
    unit2: supportedUnit
  });
  const POTENTIAL_CONVOY_SUPPORTS = new Set([]);
  const SELECTED_UNIT_POTENTIAL_MOVES = findPotentialMoves({
    unit: selectedUnit
  }).potentialMoves;
  // step 1: find occupied water territories next to supported unit
  const POTENTIAL_CONVOY_PATH = findNeighbors({
    sourceTerr: supportedUnit.territory,
    unitsList,
    occupied: true,
    occupiedType: 'fleet',
    terrType: 'water'
  });
  const CONVOY_CHECK_QUEUE = [...POTENTIAL_CONVOY_PATH];
  while (CONVOY_CHECK_QUEUE.length > 0) {
    const TERR = CONVOY_CHECK_QUEUE.shift();
    const OCCUPIED_WATER_NEIGHBORS = findNeighbors({
      sourceTerr: TERR,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    for (let terr of OCCUPIED_WATER_NEIGHBORS) {
      if (!POTENTIAL_CONVOY_PATH.has(terr)) {
        CONVOY_CHECK_QUEUE.push(terr);
      }
      POTENTIAL_CONVOY_PATH.add(terr);
    }
    const COASTAL_NEIGHBORS = findNeighbors({
      sourceTerr: TERR,
      unitsList,
      terrType: 'coastal'
    });
    for (let terr of COASTAL_NEIGHBORS) {
      if (SELECTED_UNIT_POTENTIAL_MOVES.has(terr)) {
        POTENTIAL_CONVOY_SUPPORTS.add(terr);
      }
    }
  }
  return new Set([...COMMON_MOVES, ...POTENTIAL_CONVOY_SUPPORTS]);
}

function findCommonMoves({ unit1, unit2 }) {
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
  let coast = '';
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
    if (UNIT.unit_type === 'army') {
      return (
        <Army
          key={terr}
          owner={UNIT.country}
          x={COORDS.main.x}
          y={COORDS.main.y}
        />
      );
    } else if (UNIT.unit_type === 'fleet') {
      const COAST = UNIT.coast === '' ? 'main' : UNIT.coast;
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
