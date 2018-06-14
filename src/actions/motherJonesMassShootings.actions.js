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

export const setSelectedVenue = selectedVenue => ({
  type: motherJones.SET_VENUE,
  selectedVenue
});

export const setSelectedGender = selectedGender => ({
  type: motherJones.SET_SELECTED_GENDER,
  selectedGender
});

export const setYearRange = yearRange => ({
  type: motherJones.SET_YEAR_RANGE,
  yearRange
});

export const setPrevSign = prevSign => ({
  type: motherJones.SET_PREV_SIGN,
  prevSign
});

export const resetFilters = () => ({
  type: motherJones.RESET_FILTERS
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

    // const massShootingsByState = d3
    //   .nest()
    //   .key(d => d.stateName)
    //   .entries(data);
    //
    // const selectedState = massShootingsByState.find(
    //   item => item.key === "California"
    // );
    //
    // dispatch(setSelectedState(selectedState));

    const minYear = parseInt(d3.min(data, d => d.moment.format("YYYY")), 10);
    const maxYear = parseInt(d3.max(data, d => d.moment.format("YYYY")), 10);
    dispatch(setYearRange([minYear, maxYear]));
    dispatch(setMotherJonesData(data));
    dispatch(setIsLoadingMotherJonesData(false));
  };
};
