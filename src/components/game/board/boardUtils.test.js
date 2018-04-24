import * as boardUtils from './boardUtils';

describe('boardUtils', () => {
  describe('findPotentialMoves', () => {
    it('Identifies potential moves for a non-displaced army', () => {
      const unit = {
        coast: '', country: 'England', territory: 'Swe', unit_type: 'army'
      };
      expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
        new Set(['Den', 'Fin', 'Nwy'])
      );
    });

    it('Identifies potential moves for a non-displaced fleet (no coast)',
      () => {
        const unit = {
          coast: '', country: 'Russia', territory: 'Sev', unit_type: 'fleet'
        }
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['Arm', 'BLA', 'Rum'])
        );
      });
    
    it('Identifies potential moves for a non-displaced fleet (with coast)',
      () => {
        const unit = {
          coast: 'SC', country: 'Russia', territory: 'Stp', unit_type: 'fleet'
        };
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['BOT', 'Fin', 'Lvn'])
        );
      });
    
    it('Identifies potential moves for a displaced army', () => {
      const unit = {
        coast: '', country: 'England', unit_type: 'army',
        retreating_from: 'Swe', invaded_from: 'Den'
      };
      const displaced = true;
      const unitsList = {
        Swe: {
          coast: '', country: 'Germany', territory: 'Swe', unit_type: 'army'
        },
        Fin: {
          coast: '', country: 'Russia', territory: 'Fin', unit_type: 'fleet'
        }
      }
      expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
        .potentialMoves).toEqual(new Set(['Nwy']));
    });

    it('Identifies potential moves for a displaced fleet (no coast)',
      () => {
        const unit = {
          coast: '', country: 'Russia', unit_type: 'fleet',
          retreating_from: 'Sev', invaded_from: 'Rum'
        };
        const displaced = true;
        const unitsList = {
          Sev: {
            coast: '', country: 'Turkey', territory: 'Sev', unit_type: 'army'
          },
          BLA: {
            coast: '', country: 'Turkey', territory: 'BLA', unit_type: 'fleet'
          }
        }
        expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['Arm']));
      });
    
    it('Identifies potential moves for a displaced fleet (with coast)',
      () => {
        const unit = {
          coast: 'SC', country: 'Russia', unit_type: 'fleet',
          retreating_from: 'Stp', invaded_from: 'Fin'
        };
        const displaced = true;
        const unitsList = {
          Stp: {
            coast: '', country: 'England', territory: 'Stp', unit_type: 'army'
          },
          Lvn: {
            coast: '', country: 'Germany', territory: 'Lvn', unit_type: 'army'
          }
        }
        expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
          .potentialMoves).toEqual(new Set(['BOT']));
      }
    );

    it('Removes coast data from potential moves for fleets', () => {
      const unit = {
        coast: '', country: 'France', territory: 'MAO', unit_type: 'fleet'
      };
      expect(boardUtils.findPotentialMoves({ unit }).potentialMoves)
        .toContain('Spa');
    });

    it('Returns the coast options in a separate object', () => {
      const unit = {
        coast: '', country: 'France', territory: 'MAO', unit_type: 'fleet'
      };
      expect(boardUtils.findPotentialMoves({ unit }).coastOptions).toEqual(
        { 'Spa': ['NC', 'SC'] }
      );
    });
  })

  describe('findPotentialSupports', () => {
    it('Identifies neighbors that can be supported', () => {
      const unit = {
        coast: '', country: 'Austria', territory: 'Vie', unit_type: 'army'
      };
      const unitsList = {
        Bud: {
          coast: '', country: 'Austria', territory: 'Bud', unit_type: 'army'
        }
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['Bud'])
      );
    })

    it('Identifies second degree neighbors with common moves', () => {
      const unit = {
        coast: '', country: 'Austria', territory: 'Vie', unit_type: 'army'
      };
      const unitsList = {
        War: {
          coast: '', country: 'Russia', territory: 'War', unit_type: 'army'
        }
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set(['War'])
      );
    })

    it('Excludes second degree neighbors without common moves', () => {
      const unit = {
        coast: '', country: 'Germany', territory: 'Mun', unit_type: 'army'
      };
      const unitsList = {
        Tri: {
          coast: '', country: 'Austria', territory: 'Tri', unit_type: 'fleet'
        }
      };
      expect(boardUtils.findPotentialSupports({ unit, unitsList })).toEqual(
        new Set([])
      );
    })

    it('Identifies convoyed units that can be supported', () => {
      const unit = {
        coast: '', country: 'France', territory: 'Mar', unit_type: 'army'
      };
      const unitsList = {
        Lon: {
          coast: '', country: 'England', territory: 'Lon', unit_type: 'army'
        },
        MAO: {
          coast: '', country: 'France', territory: 'MAO', unit_type: 'fleet'
        },
        ENG: {
          coast: '', country: 'France', territory: 'ENG', unit_type: 'fleet'
        }
      }
      expect(boardUtils.findPotentialSupports({ unit, unitsList }))
        .toContain('Lon');
    })
  })

  describe('findPotentialSupportedMoves', () => {
    it('Identifies common moves between two units', () => {
      const selectedUnit = {
        coast: '', country: 'France', territory: 'Par', unit_type: 'army'
      };
      const supportedUnit = {
        coast: '', country: 'France', territory: 'Bel', unit_type: 'army'
      };
      const unitsList = {
        Par: selectedUnit,
        Bel: supportedUnit
      }
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Bur', 'Pic']));
    });

    it('Does not include the selected unit\'s territory', () => {
      const selectedUnit = {
        coast: '', country: 'France', territory: 'Par', unit_type: 'army'
      };
      const supportedUnit = {
        coast: '', country: 'France', territory: 'Bur', unit_type: 'army'
      };
      const unitsList = {
        Par: selectedUnit,
        Bur: supportedUnit
      }
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).not.toContain('Par');
    })

    it('Includes territories to which the supported unit can convoy', () => {
      const selectedUnit = {
        coast: '', country: 'France', territory: 'Mar', unit_type: 'army'
      };
      const supportedUnit = {
        coast: '', country: 'England', territory: 'Lon', unit_type: 'army'
      };
      const unitsList = {
        Mar: selectedUnit,
        Lon: supportedUnit,
        MAO: {
          coast: '', country: 'France', territory: 'MAO', unit_type: 'fleet'
        },
        ENG: {
          coast: '', country: 'France', territory: 'ENG', unit_type: 'fleet'
        }
      };
      expect(boardUtils.findPotentialSupportedMoves(
        { selectedUnit, supportedUnit, unitsList }
      )).toEqual(new Set(['Gas', 'Spa']))
    })
  })
})