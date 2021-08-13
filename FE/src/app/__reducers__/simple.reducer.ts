import { Action } from '@ngrx/store';

export const simpleReducer = (state = 'hello', action: Action) => {
  switch (action.type) {
    case 'SPANISH':
      return (state = 'Hola Mundo');

    case 'FRENCH':
      return (state = 'Bonjour tous le monde');

    default:
      return state;
  }
};
