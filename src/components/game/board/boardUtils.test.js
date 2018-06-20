import * as bu from './boardUtils';

describe('boardUtils', () => {
  describe('findPotentialMoves', () => {
    it('Identifies potential moves for a non-displaced army', () => {
      const unit = { territory: 'Swe', unitType: 'army' };
      expect(bu.findPotentialMoves({ unit }).potentialMoves).toEqual(
        new Set(['Den', 'Fin', 'Nwy'])
      );
    });

    it('Identifies potential moves for a non-displaced fleet (no coast)',
      () => {
        const unit = { territory: 'Sev', unitType: 'fleet' };
        expect(bu.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['Arm', 'BLA', 'Rum'])
        );
      });
    
    it('Identifies potential moves for a non-displaced fleet (with coast)',
      () => {
        const unit = { coast: 'SC', territory: 'Stp', unitType: 'fleet' };
        expect(bu.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['BOT', 'Fin', 'Lvn'])
        );
      });
    
    it('Identifies potential moves for a displaced army', () => {
      const unit = {
        unitType: 'army', retreatingFrom: 'Swe', invadedFrom: 'Den'
      };
      const displaced = true;
      const unitsList = {
        Swe: { territory: 'Swe', unitType: 'army' },
        Fin: { territory: 'Fin', unitType: 'fleet' }
      };
      expect(bu.findPotentialMoves({ unit, displaced, unitsList })
        .potentialMoves).toEqual(new Set(['Nwy']));
    });

    it('Identifies potential moves for a displaced fleet (no coast)',
      () => {
        const unit = {
          unitType: 'fleet', retreatingFrom: 'Sev', invadedFrom: 'Rum'
        };
        const displaced = true;
        const unitsList = {
          Sev: { territory: 'Sev', unitType: 'army' },
          BLA: { territory: 'BLA', unitType: 'fleet' }
        };
        expect(bu.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['Arm']));
      });
    
    it('Identifies potential moves for a displaced fleet (with coast)',
      () => {
        const unit = {
          coast: 'SC', unitType: 'fleet', retreatingFrom: 'Stp',
          invadedFrom: 'Fin'
        };
        const displaced = true;
        const unitsList = {
          Stp: { territory: 'Stp', unitType: 'army' },
          Lvn: { territory: 'Lvn', unitType: 'army' }
        };
        expect(bu.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['BOT']));
      }
    );

    it('Removes coast data from potential moves for fleets', () => {
      const unit = { territory: 'MAO', unitType: 'fleet' };
      expect(bu.findPotentialMoves({ unit }).potentialMoves)
        .toContain('Spa');
    });

    it('Returns the coast options in a separate object', () => {
      const unit = { territory: 'MAO', unitType: 'fleet' };
      expect(bu.findPotentialMoves({ unit }).coastOptions).toEqual(
        { 'Spa': ['NC', 'SC'] }
      );
    });
  });

  describe('findPotentialSupports', () => {
    it('Identifies neighbors that can be supported', () => {
      const unit = { territory: 'Vie', unitType: 'army' };
      const unitsList = {
        Bud: { territory: 'Bud', unitType: 'army' }
      };
      expect(bu.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['Bud'])
      );
    });

    it('Identifies second degree neighbors with common moves', () => {
      const unit = { territory: 'Vie', unitType: 'army' };
      const unitsList = {
        War: { territory: 'War', unitType: 'army' }
      };
      expect(bu.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['War'])
      );
    });

    it('Excludes second degree neighbors without common moves', () => {
      const unit = { territory: 'Mun', unitType: 'army' };
      const unitsList = {
        Tri: { territory: 'Tri', unitType: 'fleet' }
      };
      expect(bu.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set()
      );
    });

    it('Identifies convoyed units that can be supported', () => {
      const unit = { territory: 'Mar', unitType: 'army' };
      const unitsList = {
        Lon: { territory: 'Lon', unitType: 'army' },
        MAO: { territory: 'MAO', unitType: 'fleet' },
        ENG: { territory: 'ENG', unitType: 'fleet' }
      };
      expect(bu.findPotentialSupports({ unit, unitsList }))
        .toContain('Lon');
    });
  });

  describe('findPotentialSupportedMoves', () => {
    it('Identifies common moves between two units', () => {
      const selectedUnit = { territory: 'Par', unitType: 'army' };
      const supportedUnit = { territory: 'Bel', unitType: 'army' };
      const unitsList = {
        Par: selectedUnit,
        Bel: supportedUnit
      };
      expect(bu.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Bur', 'Pic']));
    });

    it('Does not include the selected unit\'s territory', () => {
      const selectedUnit = { territory: 'Par', unitType: 'army' };
      const supportedUnit = { territory: 'Bur', unitType: 'army' };
      const unitsList = {
        Par: selectedUnit,
        Bur: supportedUnit
      };
      expect(bu.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).not.toContain('Par');
    });

    it('Includes territories to which the supported unit can convoy', () => {
      const selectedUnit = { territory: 'Mar', unitType: 'army' };
      const supportedUnit = { territory: 'Lon', unitType: 'army' };
      const unitsList = {
        Mar: selectedUnit,
        Lon: supportedUnit,
        MAO: { territory: 'MAO', unitType: 'fleet' },
        ENG: { territory: 'ENG', unitType: 'fleet' }
      };
      expect(bu.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Gas', 'Spa']));
    });
  });

  describe('findPotentialConvoys', () => {
    it('Identifies neighboring fleets in water territories', () => {
      const unit = { territory: 'Bre', unitType: 'army' };
      const unitsList = {
        Bre: unit,
        ENG: { territory: 'ENG', unitType: 'fleet' }
      };
      expect(bu.findPotentialConvoys({ unit, unitsList }))
        .toEqual(new Set(['ENG']));
    });

    it('Excludes neighboring fleets in coastal territories', () => {
      const unit = { territory: 'Bre', unitType: 'army' };
      const unitsList = {
        Bre: unit,
        Pic: { territory: 'Pic', unitType: 'fleet' }
      };
      expect(bu.findPotentialConvoys({ unit, unitsList })).toEqual(new Set());
    });
  });

  describe('findPotentialConvoyPaths', () => {
    let WAL_army, IRI_fleet, ENG_fleet, convoyeurs, unitsList;
    beforeEach(() => {
      WAL_army = { territory: 'Wal', unitType: 'army' };
      ENG_fleet = { territory: 'ENG', unitType: 'fleet' };
      IRI_fleet = { territory: 'IRI', unitType: 'fleet' };
      convoyeurs = new Set([ENG_fleet, IRI_fleet]);
      unitsList = {
        Wal: WAL_army,
        ENG: ENG_fleet,
        IRI: IRI_fleet,
        MAO: {
          territory: 'MAO', unitType: 'fleet'
        }
      };
    });

    it('Includes neighboring fleets in water territories', () => {
      expect(bu.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).toContain('MAO');
    });

    it('Includes neighboring coastal territories', () => {
      expect(bu.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).toContain('Lvp');
    });

    it('Excludes fleets which are already part of the convoy route', () => {
      expect(bu.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).not.toContain('ENG');
    });

    it('Excludes the selected unit\'s territory', () => {
      expect(bu.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).not.toContain('Wal');
    });
  });

  describe('findNeighbors', () => {
    let unitsList;
    beforeEach(() => {
      unitsList = {
        Ank: { territory: 'Ank', unitType: 'army' },
        BLA: { territory: 'BLA', unitType: 'fleet' },
        Bul: { territory: 'Bul', unitType: 'fleet', coast: 'SC' }
      };
    });

    it('Can identify all neighbors', () => {
      expect(bu.findNeighbors({ sourceTerr: 'Lon' }))
        .toEqual(new Set(['Wal', 'Yor', 'ENG', 'NTH']));
    });

    it('Can identify land neighbors', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Lon', neighborType: 'land' }
      )).toEqual(new Set(['Wal', 'Yor']));
    });

    it('Can identify sea neighbors (no coast)', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Lon', neighborType: 'sea' }
      )).toEqual(new Set(['ENG', 'NTH', 'Wal', 'Yor']));
    });

    it('Can identify sea neighbors (with coast)', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Spa', neighborType: 'sea', coast: 'NC' }
      )).toEqual(new Set(['Gas', 'MAO', 'Por']));
    });

    it('Can identify neighbors of a particular type', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Bur', terrType: 'inland' }
      )).toEqual(new Set(['Mun', 'Ruh', 'Par']));
    });

    it('Can identify occupied neighbors', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Con', unitsList, occupied: true }
      )).toEqual(new Set(['Ank', 'Bul', 'BLA']));
    });

    it('Can identify occupied neighbors of a particular type', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Con', unitsList, occupied: true, occupiedType: 'fleet' }
      )).toEqual(new Set(['Bul', 'BLA']));
    });

    it('Can preserve coast data if specified', () => {
      expect(bu.findNeighbors(
        { sourceTerr: 'Con', keepCoastData: true }
      )).toEqual(new Set(['Ank', 'Bul', 'Smy', 'AEG', 'BLA', 'Bul_SC',
        'Bul_EC']));
    });
  });

  describe('terrMatchesCriteria', () => {
    let unitsList;
    beforeEach(() => {
      unitsList = {
        Lon: { territory: 'Lon', unitType: 'army' }
      };
    });

    it('Can filter by occupied territory', () => {
      expect(bu.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: true }
      )).toBe(true);
    });

    it('Can filter by unoccupied territory', () => {
      expect(bu.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: false }
      )).toBe(false);
    });

    it('Can filter by occupying unit type', () => {
      expect(bu.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: true, occupiedType: 'fleet' }
      )).toBe(false);
    });

    it('Can filter by territory type', () => {
      expect(bu.terrMatchesCriteria(
        { terr: 'Lon', terrType: 'inland' }
      )).toBe(false);
    });
  });

  describe('splitTerrName', () => {
    it('Removes the coast suffix from the territory name', () => {
      expect(bu.splitTerrName({ terr: 'Spa_SC' })).toEqual('Spa');
    });
  });

  describe('findCommonMoves', () => {
    it('Identifies the union between the potential moves of two units', () => {
      const unit1 = { territory: 'Mar', unitType: 'army' };
      const unit2 = { territory: 'MAO', unitType: 'fleet' };
      expect(bu.findCommonMoves({ unit1, unit2 }))
        .toEqual(new Set(['Gas', 'Spa']));
    });
  });

  describe('getDisplacedUnitsForPlayer', () => {
    it(`Returns an object containing an array of displaced units from
        countries owned by the player`, () => {
      const nextProps = {
        currentUser: { id: '1', },
        countries: {
          Austria: { user: '1', retreatingUnits: ['Tri'] },
          England: { user: '1', retreatingUnits: ['Lon'] },
          France: { user: '2', retreatingUnits: ['Par'] },
        },
      };
      expect(bu.getDisplacedUnitsForPlayer(nextProps)).toEqual(
        { displacedUnits: ['Tri', 'Lon'] }
      );
    });
  });

  describe('findPotentialAdditionsAndDeletions', () => {
    it('Finds where units can be added and deleted', () => {
      const nextProps = {
        currentUser: { id: '1', },
        countries: {
          Austria: {
            name: 'Austria',
            user: '1',
            territories: ['Vie', 'Bud'],
            units: ['Vie'],
          },
          England: {
            name: 'England',
            user: '1',
            territories: ['Lon'],
            units: ['Lon', 'ENG']
          },
          France: {
            name: 'France',
            user: '2',
            territories: ['Par', 'Mar'],
            units: ['Par']
          },
        },
      };
      expect(bu.findPotentialAdditionsAndDeletions(nextProps)).toEqual(
        {
          potentialAdditions: ['Bud'],
          potentialDeletions: ['Lon', 'ENG'],
          displacedUnits: [],
        }
      );
    });
  });
});