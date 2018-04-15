import {
  CREATE_CONVOY_ROUTE,
  CREATE_ORDER,
  LOGOUT
} from '../actions/actionTypes';

const convoyRoutes = (state = [], action) => {
  let newState;
  switch (action.type) {
    case CREATE_CONVOY_ROUTE:
      newState = [...state];
      newState.push(action.payload);
      return newState;
    case CREATE_ORDER:
      newState = [];
      for (let convoy_route of state) {
        let valid = true;
        for (let convoyeur of convoy_route.route) {
          if (convoyeur.id === action.payload.unit_id) {
            valid = false;
            break;
          }
        }
        if (valid) {
          newState.push(convoy_route);
        }
      }
      return newState;
    case LOGOUT:
      return [];
    default:
      return state;
  }
};

export default convoyRoutes;
