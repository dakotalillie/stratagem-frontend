import {
  CREATE_CONVOY_ROUTE,
  CREATE_ORDER,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';

const convoyRoutes = (state = [], action) => {
  let newState;
  switch (action.type) {
  case CREATE_CONVOY_ROUTE:
    newState = [ ...state ];
    newState.push(action.payload);
    return newState;
  case CREATE_ORDER:
    newState = state.filter(convoyRoute => {
      if (convoyRoute.unitId === action.payload.unitId) return false;
      for (const convoyer of convoyRoute.route) {
        if (convoyer.id === action.payload.unitId) {
          return false;
        }
      }
      return true;
    });
    return newState;
  case CLEAR_GAME_DETAIL_DATA:
  case LOGOUT:
    return [];
  default:
    return state;
  }
};

export default convoyRoutes;
