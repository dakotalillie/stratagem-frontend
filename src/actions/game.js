import { INITIALIZE_GAME, CREATE_ORDER } from './actionTypes';

export const initializeGame = () => {
  return {
    type: INITIALIZE_GAME
  };
};

export const createOrder = args => {
  return {
    ...args,
    type: CREATE_ORDER
  };
};
