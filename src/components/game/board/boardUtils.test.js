import * as boardUtils from './boardUtils';

describe('boardUtils', () => {
  describe('findPotentialMoves', () => {
    it('Correctly identifies potential moves for a non-displaced army', () => {
      const unit = {
        coast: '', country: 'England', territory: 'Swe', unit_type: 'army'
      };
      expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
        new Set(['Den', 'Fin', 'Nwy'])
      );
    });

    it('Correctly identifies potential moves for a non-displaced fleet ' +
      '(no coast)', () => {
        const unit = {
          coast: '', country: 'Russia', territory: 'Sev', unit_type: 'fleet'
        }
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['Arm', 'BLA', 'Rum'])
        );
      });
    
    it('Correctly identifies potential moves for a non-displaced fleet ' +
      '(with coast)', () => {
        const unit = {
          coast: 'SC', country: 'Russia', territory: 'Stp', unit_type: 'fleet'
        };
        expect(boardUtils.findPotentialMoves({ unit }).potentialMoves).toEqual(
          new Set(['BOT', 'Fin', 'Lvn'])
        );
      });
    
    it('Correctly identifies potential moves for a displaced army', () => {
      const unit = {
        coast: '', country: 'England', unit_type: 'army',
        retreating_from: 'Swe', invaded_from: 'Den'
      };
      const displaced = true;
      const unitsList = {
        Den: {
          coast: '', country: 'Germany', territory: 'Swe', unit_type: 'army'
        },
        Fin: {
          coast: '', country: 'Russia', territory: 'Fin', unit_type: 'fleet'
        }
      }
      expect(boardUtils.findPotentialMoves({ unit, displaced, unitsList })
        .potentialMoves).toEqual(new Set(['Nwy']));
    });

    it('Correctly identifies potential moves for a displaced fleet (no coast)',
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
    
    it('Correctly identifies potential moves for a displaced fleet (with coast)',
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
})