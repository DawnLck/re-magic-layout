/**
 * Store
 */

import { createStore } from 'redux';

function switchLayoutType(
  state = {
    layout: 'float',
  },
  action: any,
) {
  switch (action.type) {
    case 'layout/flex':
      return {
        layout: 'flex',
      };
    case 'layout/float':
      return {
        layout: 'float',
      };
    case 'layout/free':
      return {
        layout: 'free',
      };
    case 'layout/grid':
      return {
        layout: 'grid',
      };
    default:
      return state;
  }
}

const store = createStore(switchLayoutType);

export default store;
