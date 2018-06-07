import * as motherJones from "../action-types/motherJonesMassShootings.actionTypes";

const initialState = {
  isLoading: false,
  data: [],
  filteredData: [],
  selectedState: null,
  selectedRace: null,
  selectedGender: {
    male: true,
    female: true
  }
};
export default (state = initialState, action) => {
  switch (action.type) {
    case motherJones.SET_DATA:
      return {
        ...state,
        data: action.data
      };
    case motherJones.SET_FILTERED_DATA:
      return {
        ...state,
        filteredData: action.data
      };
    case motherJones.IS_LOADING_DATA:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case motherJones.SET_SELECTED_STATE:
      return {
        ...state,
        selectedState: action.selectedState
      };
    case motherJones.SET_SELECTED_RACE:
      return {
        ...state,
        selectedRace: action.selectedRace
      };
    case motherJones.SET_SELECTED_GENDER:
      return {
        ...state,
        selectedGender: { ...state.selectedGender, ...action.selectedGender }
      };
    default:
      return initialState;
  }
};
