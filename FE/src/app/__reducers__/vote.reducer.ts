import { Action } from '@ngrx/store';

export const voteReducer = (state = 0, action: Action) => {
  switch (action.type) {
    case 'UPVOTE':
      return state + 1;

    case 'DOWNVOTE':
      return state - 1;

    default:
      return state;
  }
};
