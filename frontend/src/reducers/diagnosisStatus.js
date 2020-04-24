import { SET_DIAGNOSIS_COMPLETE_STATUS } from '../actions/types';

export default function diagnosisStatus(state = false, action) {
  switch (action.type) {
    case SET_DIAGNOSIS_COMPLETE_STATUS:
      return action.payload;
    default:
      return state;
  }
}
