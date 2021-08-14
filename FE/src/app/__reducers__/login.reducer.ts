import { Action } from '@ngrx/store';

export const loginReducer = (state = false, action: Action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      return (state = true);

    case 'SET_LOGGED_OUT':
      return (state = false);

    default:
      return state;
  }
};
