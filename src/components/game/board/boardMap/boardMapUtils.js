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
