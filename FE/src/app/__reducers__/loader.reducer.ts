import { Action } from '@ngrx/store';

export const loaderReducer = (state = false, action: Action) => {
  switch (action.type) {
    case 'START_LOADING':
      return state = true;

    case 'STOP_LOADING':
      return state = false;

    default:
      return state;
  }
};
