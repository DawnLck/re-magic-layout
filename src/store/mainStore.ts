/**
 * Store
 */

import { createStore } from 'redux';

function reducer(
  state = {
    layout: 'float',
  },
  action: any,
) {
  switch (action.type) {
    case 'layout':
      return {
        layout: action.value,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
