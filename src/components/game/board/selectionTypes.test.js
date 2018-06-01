import discernSelectionType, * as selectionTypes from './selectionTypes';

describe('selectionTypes', () => {
  describe('discernSelectionType', () => {
    describe('diplomatic phase', () => {
      const phase = 'diplomatic';

      describe('normal mode', () => {
        const state = { mode: 'normal' }

        it('Recognizes selecting a unit', () => {
          state.selectedUnit = null;
          const clickedUnit = { territory: 'Par', unitType: 'army' }
          expect(discernSelectionType({ state, clickedUnit, phase }))
            .toEqual(selectionTypes.SELECT_UNIT);
        });
  
        it('Recognizes holding a unit', () => {
          state.selectedUnit = { territory: 'Par', unitType: 'army' }
          const clickedTerr = 'Par';
          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.HOLD_UNIT);
        });
  
        it('Recognizes moving a unit', () => {
          state.selectedUnit = { territory: 'Par', unitType: 'army' };
          state.potentialMoves = new Set(['Bur']);
          const clickedTerr = 'Bur';
          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.MOVE_UNIT);
        });
      });
      
      describe('support mode', () => {
        const state = { mode: 'support' }

        it('Recognizes selecting a supporting unit', () => {
          state.selectedUnit = null;
          const clickedUnit = { territory: 'Par', unitType: 'army' };
          expect(discernSelectionType({ state, clickedUnit, phase }))
            .toEqual(selectionTypes.SELECT_SUPPORTING_UNIT);
        });
  
        it('Recognizes selecting a supported unit', () => {
          state.potentialMoves = new Set(['Mar']);
          state.supportedUnit = null;
          const clickedTerr = 'Mar';
          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.SELECT_SUPPORTED_UNIT);
        });
  
        it('Recognizes holding a supported unit', () => {
          state.selectedUnit = { territory: 'Par', unitType: 'army' };
          state.supportedUnit = { territory: 'Bur', unitType: 'army' };
          state.potentialMoves = new Set([]);
          const clickedTerr = 'Bur';
          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.HOLD_SUPPORTED_UNIT);
        });
      });
      
      describe('convoy mode', () => {
        const state = { mode: 'convoy' }

        it('Recognizes selecting a convoyed unit', () => {
          state.selectedUnit = null;
          const clickedUnit = { territory: 'Lon', unitType: 'army' };

          expect(discernSelectionType({ state, clickedUnit, phase }))
            .toEqual(selectionTypes.SELECT_CONVOYED_UNIT);
        });

        it('Recognizes selecting a convoy path', () => {
          state.potentialMoves = new Set(['ENG']);
          const clickedTerr = 'ENG';

          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.SELECT_CONVOY_PATH);
        });

        it('Recognizes selecting a convoy destination', () => {
          state.potentialMoves = new Set(['Bre']);
          const clickedTerr = 'Bre';

          expect(discernSelectionType({ state, clickedTerr, phase }))
            .toEqual(selectionTypes.SELECT_CONVOY_DESTINATION);
        });
      });
    });

    describe('retreat phase', () => {
      const phase = 'retreat';

      it('Recognizes selecting a displaced unit', () => {
        const state = {
          selectedUnit: null,
          displacedUnits: ['Mun'],
        };
        const clickedTerr = 'Mun'
        expect(discernSelectionType({ state, clickedTerr, phase }))
          .toEqual(selectionTypes.SELECT_DISPLACED_UNIT);
      });

      it('Recognizes moving a displaced unit', () => {
        const state = {
          selectedUnit: { retreatingFrom: 'Mun', unitType: 'army' },
          displacedUnits: ['Mun'],
          potentialMoves: new Set(['Ruh'])
        };
        const clickedTerr = 'Ruh';
        expect(discernSelectionType({ state, clickedTerr, phase }))
          .toEqual(selectionTypes.MOVE_DISPLACED_UNIT);
      });

      it('Recognizes deleting a displaced unit', () => {
        const state = {
          selectedUnit: { retreatingFrom: 'Mun', unitType: 'army' },
          displacedUnits: ['Mun'],
          potentialMoves: new Set(['Ruh']),
        };
        const clickedTerr = 'Mun';
        expect(discernSelectionType({ state, clickedTerr, phase }))
          .toEqual(selectionTypes.DELETE_DISPLACED_UNIT);
      })
    });

    describe('reinforcement phase', () => {
      const phase = 'reinforcement';

      it('Recognizes adding a unit', () => {
        const state = { potentialAdditions: ['Lon'] };
        const clickedTerr = 'Lon';
        expect(discernSelectionType({ state, clickedTerr, phase }))
          .toEqual(selectionTypes.ADD_UNIT);
      });

      it('Recognizes deleting a unit', () => {
        const state = { potentialDeletions: ['Gal'], potentialAdditions: [] };
        const clickedTerr = 'Gal';
        expect(discernSelectionType({ state, clickedTerr, phase }))
          .toEqual(selectionTypes.DELETE_UNIT);
      });
    })
  });
});