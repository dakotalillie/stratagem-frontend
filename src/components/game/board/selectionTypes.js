import territoryData from '../../../utils/territories.json';
import { findPotentialMoves } from './boardUtils';

// These are the kinds of selections that can occur:
export const SELECT_UNIT = 'SELECT UNIT';
export const HOLD_UNIT = 'HOLD UNIT';
export const MOVE_UNIT = 'MOVE UNIT';
export const SELECT_SUPPORTING_UNIT = 'SELECT SUPPORTING UNIT';
export const SELECT_SUPPORTED_UNIT = 'SELECT SUPPORTED UNIT';
export const HOLD_SUPPORTED_UNIT = 'HOLD SUPPORTED UNIT';
export const MOVE_SUPPORTED_UNIT = 'MOVE SUPPORTED UNIT';
export const SELECT_CONVOYED_UNIT = 'SELECT CONVOYED UNIT';
export const SELECT_CONVOY_PATH = 'SELECT CONVOY PATH';
export const SELECT_CONVOY_DESTINATION = 'SELECT CONVOY DESTINATION';
export const ADD_UNIT = 'ADD UNIT';
export const DELETE_UNIT = 'DELETE UNIT';
export const SELECT_DISPLACED_UNIT = 'SELECT DISPLACED UNIT';
export const MOVE_DISPLACED_UNIT = 'MOVE DISPLACED UNIT';
export const DELETE_DISPLACED_UNIT = 'DELETE DISPLACED UNIT';

// This function determines the type of action that should occur when
// a territory is clicked.
export function discernSelectionType({
  state,
  units,
  clickedTerr,
  clickedUnit,
  phase
}) {
  if (phase === 'diplomatic') {
    if (
      state.mode === 'normal' &&
      clickedUnit !== undefined &&
      state.selectedUnit === null
    ) {
      return SELECT_UNIT;
    } else if (
      state.mode === 'normal' &&
      state.selectedUnit !== null &&
      state.selectedUnit.territory === clickedTerr
    ) {
      return HOLD_UNIT;
    } else if (
      state.mode === 'normal' &&
      state.potentialMoves.has(clickedTerr)
    ) {
      return MOVE_UNIT;
    } else if (
      state.mode === 'support' &&
      clickedUnit !== undefined &&
      state.selectedUnit === null
    ) {
      return SELECT_SUPPORTING_UNIT;
    } else if (
      state.mode === 'support' &&
      state.potentialMoves.has(clickedTerr) &&
      state.supportedUnit === null
    ) {
      return SELECT_SUPPORTED_UNIT;
    } else if (
      state.mode === 'support' &&
      state.supportedUnit !== null &&
      state.supportedUnit.territory === clickedTerr &&
      findPotentialMoves({ unit: state.selectedUnit }).potentialMoves.has(
        clickedTerr
      )
    ) {
      return HOLD_SUPPORTED_UNIT;
    } else if (
      state.mode === 'support' &&
      state.supportedUnit !== null &&
      state.potentialMoves.has(clickedTerr)
    ) {
      return MOVE_SUPPORTED_UNIT;
    } else if (
      state.mode === 'convoy' &&
      clickedUnit !== undefined &&
      clickedUnit.unit_type === 'army' &&
      state.selectedUnit === null
    ) {
      return SELECT_CONVOYED_UNIT;
    } else if (
      state.mode === 'convoy' &&
      state.potentialMoves.has(clickedTerr) &&
      territoryData[clickedTerr].type === 'water'
    ) {
      return SELECT_CONVOY_PATH;
    } else if (
      state.mode === 'convoy' &&
      state.potentialMoves.has(clickedTerr) &&
      territoryData[clickedTerr].type !== 'water'
    ) {
      return SELECT_CONVOY_DESTINATION;
    }
  } else if (phase === 'retreat') {
    if (
      state.displacedUnits.includes(clickedTerr) &&
      clickedUnit !== undefined &&
      state.selectedUnit === null
    ) {
      return SELECT_DISPLACED_UNIT;
    } else if (
      state.selectedUnit !== undefined &&
      state.potentialMoves.has(clickedTerr)
    ) {
      return MOVE_DISPLACED_UNIT;
    } else if (
      state.selectedUnit !== undefined &&
      state.selectedUnit.territory === clickedTerr
    ) {
      return DELETE_DISPLACED_UNIT;
    }
  } else if (phase === 'reinforcement') {
    if (state.potentialAdditions.includes(clickedTerr)) {
      return ADD_UNIT;
    } else if (state.potentialDeletions.includes(clickedTerr)) {
      return DELETE_UNIT;
    }
  }
}
