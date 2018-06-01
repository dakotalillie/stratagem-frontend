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
      newState[action.payload.unit_id] = action.payload;
      return newState;
    case CREATE_ORDER:
      newState = { ...state };
      // Giving a new order to the convoyed army will cancel the route.
      if (newState[action.payload.unit_id] !== undefined) {
        delete newState[action.payload.unit_id]
      }
      // Giving a new order to any of the fleets in the route will also
      // cancel the route.
      for (let convoyed_army_id of Object.values(newState)) {
        let found = false;
        for (let convoyeur of newState[convoyed_army_id].route) {
          if (convoyeur.id === action.payload.unit_id) {
            found = true;
            break;
          }
        }
        if (found) {
          delete newState[convoyed_army_id];
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
