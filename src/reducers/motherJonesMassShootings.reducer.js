import * as motherJones from "../action-types/motherJonesMassShootings.actionTypes";
import * as d3 from "d3";
const initialState = {
  isLoading: false,
  data: [],
  selectedState: null,
  selectedRace: null,
  selectedGender: {
    male: true,
    female: true
  },
  selectedYearRange: null,
  prevSign: null,
  selectedVenue: null
};
export default (state = initialState, action) => {
  switch (action.type) {
    case motherJones.SET_DATA:
      return {
        ...state,
        data: action.data
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
    case motherJones.SET_YEAR_RANGE:
      return {
        ...state,
        selectedYearRange: action.yearRange
      };
    case motherJones.SET_PREV_SIGN:
      return {
        ...state,
        prevSign: action.prevSign
      };
    case motherJones.SET_VENUE:
      return {
        ...state,
        selectedVenue: action.selectedVenue
      };
    case motherJones.RESET_FILTERS:
      const minYear = parseInt(d3.min(state.data, d => d.moment.format("YYYY")), 10);
      const maxYear = parseInt(d3.max(state.data, d => d.moment.format("YYYY")), 10);
      return {
        ...state,
        prevSign: null,
        selectedVenue: null,        
        selectedRace: null,
        selectedYearRange: [minYear, maxYear],
        selectedGender: {
          male: true,
          female: true
        },
      };
    default:
      return initialState;
  }
};
