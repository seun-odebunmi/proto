import { LOGIN_USER } from '../actions/types';
import { generateUser } from '../static-data';

const { profile_pic } = generateUser();
const user = JSON.parse(localStorage.getItem('user'));
const initState = user ? { ...user, profile_pic } : {};

export default (state = initState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...action.payload, profile_pic };
    default:
      return state;
  }
};
