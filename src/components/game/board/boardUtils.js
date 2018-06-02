import React from 'react';
import _ from 'lodash';

import Army from './army/Army';
import Fleet from './fleet/Fleet';
import territoriesData from '../../../utils/territories.json';
import countriesData from '../../../utils/countries.json';

export function findPotentialMoves({ unit, displaced, unitsList }) {
  let potentialMoves;
  let coastOptions = {};
  if (!displaced) {
    if (unit.unitType === 'army') {
      potentialMoves = findNeighbors({
        sourceTerr: unit.territory,
        neighborType: 'land'
      });
    } else if (unit.unitType === 'fleet') {
      potentialMoves = findNeighbors({
        sourceTerr: unit.territory,
        coast: unit.coast,
        neighborType: 'sea',
        keepCoastData: true
      });
    }
  } else {
    if (unit.unitType === 'army') {
      potentialMoves = findNeighbors({
        sourceTerr: unit.retreatingFrom,
        neighborType: 'land',
        occupied: false,
        unitsList
      });
    } else if (unit.unitType === 'fleet') {
      potentialMoves = findNeighbors({
        sourceTerr: unit.retreatingFrom,
        coast: unit.coast,
        neighborType: 'sea',
        occupied: false,
        unitsList,
        keepCoastData: true
      });
    }
  }
  // Handle coast information
  potentialMoves = new Set(
    [...potentialMoves].map(terr => {
      if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
        const parts = terr.split('_');
        const terrAbbr = parts[0];
        const terrCoast = parts[1];
        // Some territories might have multiple coast options. If a coast has already
        // been found, add that coast to coast options but return undefined (since
        // the territory is already in the list)
        if (coastOptions[terrAbbr] === undefined) {
          coastOptions[terrAbbr] = [terrCoast];
          return terrAbbr;
        } else {
          coastOptions[terrAbbr].push(terrCoast);
          return null;
        }
      }
      return terr;
    })
  );

  // Units can't retreat to territories they were invaded from.
  if (displaced) {
    potentialMoves.delete(unit.invadedFrom);
    delete coastOptions[unit.invadedFrom];
  }

  return { potentialMoves, coastOptions };
}

export function findPotentialSupports({ unit, unitsList }) {
  // First, generate a list of all neighboring territories, making sure to
  // filter out any coast information. Any immediate neighbors with units
  // in them form the inital batch of potential supported units.

  let potentialSupportedUnits = new Set([]);

  const immediateNeighbors = findNeighbors({ sourceTerr: unit.territory });
  for (let terr of immediateNeighbors) {
    if (unitsList[terr] !== undefined) {
      potentialSupportedUnits.add(terr);
    }
  }

  // Then, find the neighbors of each of those territories (making sure to
  // filter for duplicates).
  const secondDegreeNeighbors = new Set([]);
  for (let neighbor of immediateNeighbors) {
    const neighborNeighbors = findNeighbors({
      sourceTerr: neighbor,
      unitsList,
      occupied: true
    });
    for (let nn of neighborNeighbors) {
      if (nn !== unit.territory) {
        secondDegreeNeighbors.add(nn);
      }
    }
  }

  // Then, make sure that every potentially supported unit's potential
  // moves overlaps with the clicked unit's potential moves
  for (let terr of secondDegreeNeighbors) {
    const secondUnit = unitsList[terr];
    if (findCommonMoves({ unit1: unit, unit2: secondUnit }).size > 0) {
      potentialSupportedUnits.add(terr);
    }
  }

  // We also need to find any distant units we could support when they're
  // convoyed to an adjacent territory. First, identify the landing zones.
  const landingZones = findNeighbors({ 
    sourceTerr: unit.territory,
    coast: unit.coast,
    neighborType: unit.unitType === 'army' ? 'land' : 'sea',
    terrType: 'coastal'
  });
  // Then, find occupied water territories next to those landing zones.
  const potentialConvoyPath = new Set([]);
  for (let landingZone of landingZones) {
    const occupiedSeaNeighbors = findNeighbors({
      sourceTerr: landingZone,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    for (let terr of occupiedSeaNeighbors) {
      potentialConvoyPath.add(terr);
    }
  }
  /*
  Then, start a queue from potentialConvoyPath. For each element in the
  queue, identify any neighboring occupied water territories, adding those 
  both to the potential convoy path and the queue. Then, identify any 
  neighboring occupied coastal territories, making sure they don't match
  the supporting unit before adding them to potentialSupportedUnits. Then
  remove the element from the queue
  */
  const convoyCheckQueue = [...potentialConvoyPath];
  while (convoyCheckQueue.length > 0) {
    const terr = convoyCheckQueue.shift();
    const occupiedWaterNeighbors = findNeighbors({
      sourceTerr: terr,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    for (let terr of occupiedWaterNeighbors) {
      if (!potentialConvoyPath.has(terr)) {
        convoyCheckQueue.push(terr);
      }
      potentialConvoyPath.add(terr);
    }
    const occupiedCoastalNeighbors = findNeighbors({
      sourceTerr: terr,
      unitsList,
      occupied: true,
      occupiedType: 'army',
      terrType: 'coastal'
    });
    for (let terr of occupiedCoastalNeighbors) {
      if (terr !== unit.territory) {
        potentialSupportedUnits.add(terr);
      }
    }
  }

  return potentialSupportedUnits;
}

export function findPotentialSupportedMoves({
  selectedUnit,
  supportedUnit,
  unitsList
}) {
  const commonMoves = findCommonMoves({
    unit1: selectedUnit,
    unit2: supportedUnit
  });
  const potentialConvoySupports = new Set([]);
  if (supportedUnit.unitType === 'army') {
    const selectedUnitPotentialMoves = findPotentialMoves({
      unit: selectedUnit
    }).potentialMoves;
    // step 1: find occupied water territories next to supported unit
    const potentialConvoyPath = findNeighbors({
      sourceTerr: supportedUnit.territory,
      unitsList,
      occupied: true,
      occupiedType: 'fleet',
      terrType: 'water'
    });
    // Make sure not to include potential convoys that include the supporting
    // unit.
    potentialConvoyPath.delete(selectedUnit.territory);
    const convoyCheckQueue = [...potentialConvoyPath];
    while (convoyCheckQueue.length > 0) {
      const terr = convoyCheckQueue.shift();
      const occupiedWaterNeighbors = findNeighbors({
        sourceTerr: terr,
        unitsList,
        occupied: true,
        occupiedType: 'fleet',
        terrType: 'water'
      });
      for (let terr of occupiedWaterNeighbors) {
        if (!potentialConvoyPath.has(terr)) {
          convoyCheckQueue.push(terr);
        }
        potentialConvoyPath.add(terr);
      }
      const coastalNeighbors = findNeighbors({
        sourceTerr: terr,
        unitsList,
        terrType: 'coastal'
      });
      for (let terr of coastalNeighbors) {
        if (
          terr !== supportedUnit.territory &&
          selectedUnitPotentialMoves.has(terr)
        ) {
          potentialConvoySupports.add(terr);
        }
      }
    }
  }
  return new Set([...commonMoves, ...potentialConvoySupports]);
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

export function findPotentialConvoyPaths({
  unit,
  unitsList,
  selectedUnit,
  convoyeurs
}) {
  const occupiedSeaNeighbors = findNeighbors({
    sourceTerr: unit.territory,
    unitsList,
    occupied: true,
    occupiedType: 'fleet',
    terrType: 'water'
  });
  const coastalNeighbors = findNeighbors({
    sourceTerr: unit.territory,
    terrType: 'coastal'
  });
  const potentialConvoyPaths = new Set([
    ...occupiedSeaNeighbors,
    ...coastalNeighbors
  ]);
  // Make sure the selected unit's territory is not included as an option.
  potentialConvoyPaths.delete(selectedUnit.territory);
  // Same with any previously selected convoys
  for (let convoyeur of convoyeurs) {
    if (potentialConvoyPaths.has(convoyeur.territory)) {
      potentialConvoyPaths.delete(convoyeur.territory);
    }
  }
  return potentialConvoyPaths;
}

export function findNeighbors({
  sourceTerr, // the territory whose neighbors you seek
  coast, // get sea neighbors for a specific coast?
  unitsList, // list of units currently on the board
  neighborType, // specify land neighbors or sea neighbors? defaults to all
  occupied, // does the neighbor need to be occupied?
  occupiedType, // if the neighbor is occupied, should the unit be a specific type?
  terrType, // should the neighbor be water, coastal, or inland?
  keepCoastData // should the function not remove coast data?
}) {
  const neighbors = new Set([]);
  if (neighborType === undefined || neighborType === 'land') {
    const { landNeighbors } = territoriesData[sourceTerr];
    for (let terr of landNeighbors) {
      if (
        terrMatchesCriteria({
          terr,
          unitsList,
          occupied,
          occupiedType,
          terrType
        })
      ) {
        neighbors.add(terr);
      }
    }
  }
  if (neighborType === undefined || neighborType === 'sea') {
    const { seaNeighbors } = territoriesData[sourceTerr];
    if (seaNeighbors !== null) {
      for (let key of Object.keys(seaNeighbors)) {
        if (!coast || (coast && coast === key)) {
          for (let terrName of seaNeighbors[key]) {
            const terrAbbr = splitTerrName({ terr: terrName });
            if (
              terrMatchesCriteria({
                terr: terrAbbr,
                unitsList,
                occupied,
                occupiedType,
                terrType
              })
            ) {
              !keepCoastData ? neighbors.add(terrAbbr) : neighbors.add(terrName);
            }
          }
        }
      }
    }
  }
  return neighbors;
}

export function terrMatchesCriteria({
  terr,
  unitsList,
  occupied,
  occupiedType,
  terrType
}) {
  if (occupied === true && unitsList[terr] === undefined) return false;
  if (occupied === false && unitsList[terr] !== undefined) return false;
  if (occupiedType && unitsList[terr].unitType !== occupiedType) return false;
  if (terrType && territoriesData[terr].type !== terrType) return false;
  return true;
}

export function splitTerrName({ terr }) {
  if (terr.endsWith('SC') || terr.endsWith('EC') || terr.endsWith('NC')) {
    const parts = terr.split('_');
    return parts[0];
  }
  return terr;
}

export function findCommonMoves({ unit1, unit2 }) {
  const unitMoves = findPotentialMoves({ unit: unit1 }).potentialMoves;
  const supportedUnitMoves = findPotentialMoves({
    unit: unit2
  }).potentialMoves;
  const union = new Set(
    [...unitMoves].filter(terr => supportedUnitMoves.has(terr))
  );
  return union;
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
export function mapUnits(units) {
  return Object.keys(units).map(terr => {
    const unit = units[terr];
    const coords = territoriesData[terr].coordinates;
    if (unit.unitType === 'army') {
      return (
        <Army
          key={terr}
          owner={unit.country}
          x={coords.main.x}
          y={coords.main.y}
        />
      );
    } else if (unit.unitType === 'fleet') {
      const coast = unit.coast === '' ? 'main' : unit.coast;
      return (
        <Fleet
          key={terr}
          owner={unit.country}
          x={coords[coast].x}
          y={coords[coast].y}
        />
      );
    }
    return null;
  });
}

export function mapRetreatingUnits(units) {
  return Object.keys(units).map(terr => {
    const unit = units[terr];
    const coords = territoriesData[terr].coordinates;
    if (unit.unitType === 'army') {
      return (
        <Army
          key={terr}
          owner={unit.country}
          x={coords.main.x + 30}
          y={coords.main.y - 50}
        />
      );
    } else if (unit.unitType === 'fleet') {
      const coast = unit.coast === '' ? 'main' : unit.coast;
      return (
        <Fleet
          key={terr}
          owner={unit.country}
          x={coords[coast].x + 30}
          y={coords[coast].y - 50}
        />
      );
    }
    return null;
  });
}

export function getDisplacedUnitsForPlayer(nextProps) {
  const { currentUser, countries } = nextProps;
  let displacedUnits = [];
  const ownedCountries = findOwnedCountries(countries, currentUser.id);
  for (let country of ownedCountries) {
    displacedUnits = displacedUnits.concat(country.retreatingUnits);
  }
  return { displacedUnits };
}

export function findPotentialAdditionsAndDeletions(nextProps) {
  const { currentUser, countries } = nextProps;
  let potentialAdditions = [];
  let potentialDeletions = [];
  const ownedCountries = findOwnedCountries(countries, currentUser.id);
  for (let country of ownedCountries) {
    const supplyCenterCount = calculateSupplyCenterCount(country);
    let numberOfUnits = country.units.length;
    if (supplyCenterCount > numberOfUnits) {
      country.homeSupplyCenters = countriesData[country.name].homeSupplyCenters;
      potentialAdditions = potentialAdditions.concat(
        findAvailableHomeSupplyCenters(country)
      );
    } else if (supplyCenterCount < numberOfUnits) {
      potentialDeletions = potentialDeletions.concat(country.units)
    }
  }
  return { potentialAdditions, potentialDeletions, displacedUnits: [] };
}

export function calculateSupplyCenterCount(country) {
  let supplyCenterCount = 0;
  for (let terr of country.territories) {
    if (territoriesData[terr].supplyCenter) {
      supplyCenterCount++;
    }
  }
  return supplyCenterCount;
}

export function findAvailableHomeSupplyCenters(country) {
  return country.homeSupplyCenters.filter(terr => {
    const occupied = country.units.includes(terr);
    const owned = country.territories.includes(terr);
    if (!occupied && owned) return true;
    return false;
  });
}

export function findOwnedCountries(countries, userId) {
  return _.filter(_.values(countries), { user: userId });
}

export function buildClassNameFromAttributes(terrAbbr) {
  const { territories } = this.props;
  const { selectedUnit, supportedUnit, potentialMoves, convoyeurs,
          potentialAdditions, potentialDeletions, displacedUnits } = this.state;
  const attributes = [];

  // territories will be undefined if unowned.
  if (territories[terrAbbr] !== undefined) {
    const terrOwner = territories[terrAbbr].owner
    attributes.push(countriesData[terrOwner].posessive);
  }
  if (
    selectedUnit !== null &&
    (terrAbbr === selectedUnit.territory ||
     terrAbbr === selectedUnit.retreatingFrom)
  ) {
    attributes.push('selected')
  }
  if (
    supportedUnit !== null &&
    terrAbbr === supportedUnit.territory
  ) {
    attributes.push('supported');
  }
  if (potentialMoves.has(terrAbbr)) {
    attributes.push('potential');
  }
  for (let convoyeur of convoyeurs) {
    if (convoyeur.territory === terrAbbr) {
      attributes.push('convoy');
    }
  }
  if (potentialAdditions.includes(terrAbbr)) {
    attributes.push('addition');
  }
  if (potentialDeletions.includes(terrAbbr)) {
    attributes.push('deletion');
  }
  if (displacedUnits.includes(terrAbbr)) {
    if (
      !selectedUnit ||
      (selectedUnit &&
        selectedUnit.retreatingFrom !== terrAbbr)
    ) {
      attributes.push('displaced');
    }
  }
  return attributes.join(' ');
}