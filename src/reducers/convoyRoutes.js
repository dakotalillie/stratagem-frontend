import {
  CREATE_CONVOY_ROUTE,
  CREATE_ORDER,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';

const convoyRoutes = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case CREATE_CONVOY_ROUTE:
      newState = { ...state };
      newState[action.payload.unitId] = action.payload;
      return newState;
    case CREATE_ORDER:
      newState = { ...state };
      // Giving a new order to the convoyed army will cancel the route.
      if (newState[action.payload.unitId] !== undefined) {
        delete newState[action.payload.unitId]
      }
      // Giving a new order to any of the fleets in the route will also
      // cancel the route.
      for (let convoyedArmyId of Object.values(newState)) {
        let found = false;
        for (let convoyeur of newState[convoyedArmyId].route) {
          if (convoyeur.id === action.payload.unitId) {
            found = true;
            break;
          }
        }
        if (found) {
          delete newState[convoyedArmyId];
          break;
        }
      }
      return newState;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return [];
    default:
      return state;
  }
};

export default convoyRoutes;
