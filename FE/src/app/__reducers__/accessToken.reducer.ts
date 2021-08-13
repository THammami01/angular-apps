import { Action } from '@ngrx/store';

export const loaderReducer = (state = "", action: Action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return state = true;

    case 'STOP_LOADING':
      return state = false;

    default:
      return state;
  }
};
