import * as motherJones from "../action-types/motherJonesMassShootings.actionTypes";
import * as d3 from "d3";
import moment from "moment";
import stateCodes from "us-state-codes";

const setMotherJonesData = data => {
  return {
    type: motherJones.SET_DATA,
    data
  };
};

const setIsLoadingMotherJonesData = isLoading => {
  return {
    type: motherJones.IS_LOADING_DATA,
    isLoading
  };
};

export const setSelectedState = selectedState => ({
  type: motherJones.SET_SELECTED_STATE,
  selectedState
});

export const setSelectedRace = selectedRace => ({
  type: motherJones.SET_SELECTED_RACE,
  selectedRace
});

export const setSelectedGender = selectedGender => ({
  type: motherJones.SET_SELECTED_GENDER,
  selectedGender
});

export const setMotherJonesFilteredData = data => ({
  type: motherJones.SET_FILTERED_DATA,
  data
});

export const fetchData = () => {
  return async dispatch => {
    const PUBLIC_URL = process.env.PUBLIC_URL || "";
    dispatch(setIsLoadingMotherJonesData(true));
    const data = await d3.csv(
      `${PUBLIC_URL}/Mother Jones - Mass Shootings Database, 1982 - 2018 - Sheet1.csv`,
      item => {
        const { location } = item;
        const locationArr = location.split(",");
        const state = locationArr[locationArr.length - 1].trim();
        const stateName =
          state.length === 2
            ? stateCodes.getStateNameByStateCode(state)
            : state;
        return {
          ...item,
          stateName,
          moment: moment(item.date, "MM/DD/YYYY")
        };
      }
    );
    dispatch(setMotherJonesData(data));
    dispatch(setMotherJonesFilteredData(data));
    dispatch(setIsLoadingMotherJonesData(false));
  };
};
