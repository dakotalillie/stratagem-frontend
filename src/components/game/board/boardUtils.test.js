import * as boardUtils from './boardUtils';

describe('boardUtils', () => {
  describe('findPotentialMoves', () => {
    it('Identifies potential moves for a non-displaced army', () => {
      const unit = {territory: 'Swe', unit_type: 'army'};
      expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
        new Set(['Den', 'Fin', 'Nwy'])
      );
    });

    it('Identifies potential moves for a non-displaced fleet (no coast)',
      () => {
        const unit = {territory: 'Sev', unit_type: 'fleet'}
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['Arm', 'BLA', 'Rum'])
        );
      });
    
    it('Identifies potential moves for a non-displaced fleet (with coast)',
      () => {
        const unit = { coast: 'SC', territory: 'Stp', unit_type: 'fleet' };
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['BOT', 'Fin', 'Lvn'])
        );
      });
    
    it('Identifies potential moves for a displaced army', () => {
      const unit = {
        unit_type: 'army', retreating_from: 'Swe', invaded_from: 'Den'
      };
      const displaced = true;
      const unitsList = {
        Swe: {territory: 'Swe', unit_type: 'army'},
        Fin: {territory: 'Fin', unit_type: 'fleet'}
      }
      expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
        .potentialMoves).toEqual(new Set(['Nwy']));
    });

    it('Identifies potential moves for a displaced fleet (no coast)',
      () => {
        const unit = {
          unit_type: 'fleet', retreating_from: 'Sev', invaded_from: 'Rum'
        };
        const displaced = true;
        const unitsList = {
          Sev: {territory: 'Sev', unit_type: 'army'},
          BLA: {territory: 'BLA', unit_type: 'fleet'}
        }
        expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['Arm']));
      });
    
    it('Identifies potential moves for a displaced fleet (with coast)',
      () => {
        const unit = {
          coast: 'SC', unit_type: 'fleet', retreating_from: 'Stp',
          invaded_from: 'Fin'
        };
        const displaced = true;
        const unitsList = {
          Stp: {territory: 'Stp', unit_type: 'army'},
          Lvn: {territory: 'Lvn', unit_type: 'army'}
        }
        expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['BOT']));
      }
    );

    it('Removes coast data from potential moves for fleets', () => {
      const unit = {territory: 'MAO', unit_type: 'fleet'};
      expect(boardUtils.findPotentialMoves({ unit }).potentialMoves)
        .toContain('Spa');
    });

    it('Returns the coast options in a separate object', () => {
      const unit = {territory: 'MAO', unit_type: 'fleet'};
      expect(boardUtils.findPotentialMoves({ unit }).coastOptions).toEqual(
        { 'Spa': ['NC', 'SC'] }
      );
    });
  })

  describe('findPotentialSupports', () => {
    it('Identifies neighbors that can be supported', () => {
      const unit = {territory: 'Vie', unit_type: 'army'};
      const unitsList = {
        Bud: {territory: 'Bud', unit_type: 'army'}
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['Bud'])
      );
    })

    it('Identifies second degree neighbors with common moves', () => {
      const unit = {territory: 'Vie', unit_type: 'army'};
      const unitsList = {
        War: {territory: 'War', unit_type: 'army'}
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['War'])
      );
    })

    it('Excludes second degree neighbors without common moves', () => {
      const unit = {territory: 'Mun', unit_type: 'army'};
      const unitsList = {
        Tri: {territory: 'Tri', unit_type: 'fleet'}
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set([])
      );
    })

    it('Identifies convoyed units that can be supported', () => {
      const unit = {territory: 'Mar', unit_type: 'army'};
      const unitsList = {
        Lon: {territory: 'Lon', unit_type: 'army'},
        MAO: {territory: 'MAO', unit_type: 'fleet'},
        ENG: {territory: 'ENG', unit_type: 'fleet'}
      }
      expect(boardUtils.findPotentialSupports({ unit, unitsList }))
        .toContain('Lon');
    })
  })

  describe('findPotentialSupportedMoves', () => {
    it('Identifies common moves between two units', () => {
      const selectedUnit = {territory: 'Par', unit_type: 'army'};
      const supportedUnit = {territory: 'Bel', unit_type: 'army'};
      const unitsList = {
        Par: selectedUnit,
        Bel: supportedUnit
      }
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Bur', 'Pic']));
    });

    it('Does not include the selected unit\'s territory', () => {
      const selectedUnit = {territory: 'Par', unit_type: 'army'};
      const supportedUnit = {territory: 'Bur', unit_type: 'army'};
      const unitsList = {
        Par: selectedUnit,
        Bur: supportedUnit
      }
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).not.toContain('Par');
    })

    it('Includes territories to which the supported unit can convoy', () => {
      const selectedUnit = {territory: 'Mar', unit_type: 'army'};
      const supportedUnit = {territory: 'Lon', unit_type: 'army'};
      const unitsList = {
        Mar: selectedUnit,
        Lon: supportedUnit,
        MAO: {territory: 'MAO', unit_type: 'fleet'},
        ENG: {territory: 'ENG', unit_type: 'fleet'}
      };
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Gas', 'Spa']))
    })
  })

  describe('findPotentialConvoys', () => {
    it('Identifies neighboring fleets in water territories', () => {
      const unit = {territory: 'Bre', unit_type: 'army'};
      const unitsList = {
        Bre: unit,
        ENG: {territory: 'ENG', unit_type: 'fleet'}
      };
      expect(boardUtils.findPotentialConvoys({ unit, unitsList }))
        .toEqual(new Set(['ENG']));
    })

    it('Excludes neighboring fleets in coastal territories', () => {
      const unit = {territory: 'Bre', unit_type: 'army'};
      const unitsList = {
        Bre: unit,
        Pic: {territory: 'Pic', unit_type: 'fleet'}
      };
      expect(boardUtils.findPotentialConvoys({ unit, unitsList }))
        .toEqual(new Set([]));
    })
  });

  describe('findPotentialConvoyPaths', () => {
    let WAL_army, IRI_fleet, ENG_fleet, convoyeurs, unitsList;
    beforeEach(() => {
      WAL_army = {territory: 'Wal', unit_type: 'army'};
      ENG_fleet = {territory: 'ENG', unit_type: 'fleet'}
      IRI_fleet = {territory: 'IRI', unit_type: 'fleet'};
      convoyeurs = new Set([ENG_fleet, IRI_fleet]);
      unitsList = {
        Wal: WAL_army,
        ENG: ENG_fleet,
        IRI: IRI_fleet,
        MAO: {
          territory: 'MAO', unit_type: 'fleet'
        }
      }
    });

    it('Includes neighboring fleets in water territories', () => {
      expect(boardUtils.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).toContain('MAO');
    });

    it('Includes neighboring coastal territories', () => {
      expect(boardUtils.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).toContain('Lvp');
    });

    it('Excludes fleets which are already part of the convoy route', () => {
      expect(boardUtils.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).not.toContain('ENG');
    });

    it('Excludes the selected unit\'s territory', () => {
      expect(boardUtils.findPotentialConvoyPaths(
        { unit: IRI_fleet, unitsList, selectedUnit: WAL_army, convoyeurs }
      )).not.toContain('Wal');
    });
  })

  describe('findNeighbors', () => {
    let unitsList;
    beforeEach(() => {
      unitsList = {
        Ank: { territory: 'Ank', unit_type: 'army' },
        BLA: { territory: 'BLA', unit_type: 'fleet' },
        Bul: { territory: 'Bul', unit_type: 'fleet', coast: 'SC'}
      }
    })

    it('Can identify all neighbors', () => {
      expect(boardUtils.findNeighbors({ sourceTerr: 'Lon' }))
        .toEqual(new Set(['Wal', 'Yor', 'ENG', 'NTH']))
    });

    it('Can identify land neighbors', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Lon', neighborType: 'land' }
      )).toEqual(new Set(['Wal', 'Yor']))
    });

    it('Can identify sea neighbors (no coast)', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Lon', neighborType: 'sea' }
      )).toEqual(new Set(['ENG', 'NTH', 'Wal', 'Yor']));
    });

    it('Can identify sea neighbors (with coast)', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Spa', neighborType: 'sea', coast: 'NC' }
      )).toEqual(new Set(['Gas', 'MAO', 'Por']))
    });

    it('Can identify neighbors of a particular type', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Bur', terrType: 'inland' }
      )).toEqual(new Set(['Mun', 'Ruh', 'Par']))
    });

    it('Can identify occupied neighbors', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Con', unitsList, occupied: true }
      )).toEqual(new Set(['Ank', 'Bul', 'BLA']))
    });

    it('Can identify occupied neighbors of a particular type', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Con', unitsList, occupied: true, occupiedType: 'fleet' }
      )).toEqual(new Set(['Bul', 'BLA']))
    });

    it('Can preserve coast data if specified', () => {
      expect(boardUtils.findNeighbors(
        { sourceTerr: 'Con', keepCoastData: true }
      )).toEqual(new Set(['Ank', 'Bul', 'Smy', 'AEG', 'BLA', 'Bul_SC',
        'Bul_EC']));
    });
  })

  describe('terrMatchesCriteria', () => {
    let unitsList;
    beforeEach(() => {
      unitsList = {
        Lon: { territory: 'Lon', unit_type: 'army' }
      }
    })

    it('Can filter by occupied territory', () => {
      expect(boardUtils.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: true }
      )).toBe(true);
    });

    it('Can filter by unoccupied territory', () => {
      expect(boardUtils.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: false }
      )).toBe(false);
    });

    it('Can filter by occupying unit type', () => {
      expect(boardUtils.terrMatchesCriteria(
        { terr: 'Lon', unitsList, occupied: true, occupiedType: 'fleet' }
      )).toBe(false);
    });

    it('Can filter by territory type', () => {
      expect(boardUtils.terrMatchesCriteria(
        { terr: 'Lon', terrType: 'inland' }
      )).toBe(false);
    });
  });

  describe('splitTerrName', () => {
    it('Removes the coast suffix from the territory name', () => {
      expect(boardUtils.splitTerrName({ terr: 'Spa_SC' })).toEqual('Spa');
    });
  });

  describe('findCommonMoves', () => {
    it('Identifies the union between the potential moves of two units', () => {
      const unit1 = { territory: 'Mar', unit_type: 'army' };
      const unit2 = { territory: 'MAO', unit_type: 'fleet' };
      expect(boardUtils.findCommonMoves({ unit1, unit2 }))
        .toEqual(new Set(['Gas', 'Spa']))
    });
  });
})