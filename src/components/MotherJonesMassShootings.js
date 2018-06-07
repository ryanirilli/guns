// @flow
import * as React from "react";
import * as d3 from "d3";
import { GeoJsonLayer } from "deck.gl";
import { connect } from "react-redux";
import isEqual from "react-fast-compare";
import {
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";
import idx from "idx";

import Map from "../components/Map.react";
import GenderIcon from "../components/GenderIcon.react";
import ClientRect from "../components/ClientRect.react";

import { activeColor, inactiveColor } from "../styles/Colors";
import { BASE_SPACING_UNIT } from "../styles/Foundation";
import { PadMain } from "../styles/Padding";
import { H1, H2, P } from "../styles/Headings";

import * as motherJonesActions from "../actions/motherJonesMassShootings.actions";

import USStates from "../data/us-states";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const MapContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
`;

const ContentContainer = styled.div`
  width: 50vw;
  height: 100vh;
  background: #f5f5f5;
`;

const IncidentContainer = styled.div`
  margin-bottom: ${BASE_SPACING_UNIT * 16}px;
`;

const SelectedStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SelectedStateContent = styled.div`
  overflow-y: scroll;
`;

const GenderContainer = styled.div`
  display: flex;
  max-width: 100px;
  > div {
    flex-basis: 50%;
  }
  > div:first-child {
    padding-right: 5px;
  }
`;

const GraphsContainer = styled.div`
  height: 300px;
  display: flex;
`;

const GraphContainer = styled.div`
  flex-basis: 50%;
`;

type Props = {
  rawData: Array<Object>,
  data: Array<Object>,
  fetchData: () => void,
  selectedState: ?Object,
  setSelectedState: (?Object) => void,
  selectedRace: ?string,
  setSelectedRace: (?string) => void,
  setMotherJonesFilteredData: (Array<Object>) => void,
  selectedGender: Object,
  setSelectedGender: Object => void
};

class MotherJonesMassShootings extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchData();
  }

  render(): React.Node {
    const { selectedState } = this.props;
    const data = this.getFilteredResults();
    const massShootingsByState = d3
      .nest()
      .key(d => d.stateName)
      .entries(data);
    const layer = new GeoJsonLayer({
      id: "geojson-layer",
      data: USStates,
      pickable: true,
      stroked: true,
      filled: true,
      getFillColor: d => {
        const key = d.properties.name;
        const val = massShootingsByState.find(item => item.key === key);
        let color = [240, 240, 240, 255];
        if (val) {
          color = [223, 119, 91, 255];
        }
        if (val && val.key === idx(this.props, _ => _.selectedState.key)) {
          color = [0, 0, 0, 255];
        }
        return color;
      },
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 5000,
      onClick: state => {
        const _selectedState = massShootingsByState.find(
          item => item.key === state.object.properties.name
        );
        this.props.setSelectedState(
          isEqual(selectedState, _selectedState) ? null : _selectedState
        );
      },
      updateTriggers: {
        getFillColor: [selectedState, data]
      }
    });

    return (
      <Container>
        <MapContainer>
          <Map layers={[layer]} />
        </MapContainer>
        <ContentContainer>
          {selectedState ? this.renderSelectedState() : this.renderOverview()}
        </ContentContainer>
      </Container>
    );
  }

  renderOverview() {
    const { selectedGender } = this.props;

    return (
      <React.Fragment>
        <GenderContainer>
          <div>
            <GenderIcon
              onClick={e => this.toggleGender("male")}
              gender="male"
              isActive={selectedGender.male}
            />
            <div>Male</div>
          </div>
          <div>
            <GenderIcon
              onClick={e => this.toggleGender("female")}
              isActive={selectedGender.female}
            />
            <div>female</div>
          </div>
        </GenderContainer>
        <PadMain>
          <GraphsContainer>
            <ClientRect
              container={GraphContainer}
              render={this.renderRaceGraph}
            />
            <ClientRect
              container={GraphContainer}
              render={this.renderYearLineChart}
            />
          </GraphsContainer>
        </PadMain>
      </React.Fragment>
    );
  }

  renderRaceGraph = (clientRect: Object) => {
    const { selectedRace, rawData } = this.props;
    const massShootingsByRace = d3
      .nest()
      .key(d => MotherJonesMassShootings.getRaceFromItem(d))
      .entries(rawData);

    const data = massShootingsByRace.map(item => {
      const results = this.getFilteredResults(item.values, {
        selectedRace: true
      });
      return {
        x: item.key === "native american" ? "native" : item.key,
        y: results.length,
        color: item.key === selectedRace ? activeColor : inactiveColor
      };
    });
    return (
      <XYPlot
        yDomain={[0, d3.max(massShootingsByRace, item => item.values.length)]}
        margin={{ left: 60 }}
        height={clientRect.height}
        width={clientRect.width}
        xType={"ordinal"}
      >
        <XAxis />
        <YAxis />
        <VerticalBarSeries
          colorType="literal"
          data={data}
          onValueClick={this.handleRaceSelect}
        />
      </XYPlot>
    );
  };

  renderYearLineChart = (clientRect: Object) => {
    const { rawData } = this.props;
    const massShootingsByYear = d3
      .nest()
      .key(d => d.moment.format("YYYY"))
      .entries(rawData);
    const data = massShootingsByYear.map(item => {
      const results = this.getFilteredResults(item.values);
      return {
        y: results.length,
        x: item.key,
        stroke: inactiveColor
      };
    });
    return (
      <div>
        <XYPlot
          height={clientRect.height}
          width={clientRect.width}
          xDomain={[
            d3.min(massShootingsByYear, item => item.key),
            d3.max(massShootingsByYear, item => item.key)
          ]}
        >
          <XAxis tickFormat={v => `${v}`} />
          <YAxis />
          <LineSeries data={data} />
        </XYPlot>
      </div>
    );
  };

  handleRaceSelect = (datapoint): void => {
    const { selectedRace } = this.props;
    let race = datapoint.x === "native" ? "native american" : datapoint.x;
    race = race === selectedRace ? null : race;
    this.props.setSelectedRace(race);
  };

  static getRaceFromItem(item: Object): string {
    let itemRace = item.race.trim().toLowerCase();
    return itemRace === "-" || itemRace === "unclear" ? "other" : itemRace;
  }

  renderSelectedState() {
    const { selectedState } = this.props;
    if (!selectedState) {
      return null;
    }
    const incidents = selectedState.values;
    return (
      <SelectedStateContainer>
        <div>
          <PadMain>
            <H1>{selectedState.key}</H1>
          </PadMain>
        </div>
        <SelectedStateContent>
          <PadMain>
            {incidents.map((incident, i) =>
              MotherJonesMassShootings.renderIncident(incident, i)
            )}
          </PadMain>
        </SelectedStateContent>
      </SelectedStateContainer>
    );
  }

  toggleGender(gender: string): void {
    const genders = { ...this.props.selectedGender };
    genders[gender] = !genders[gender];
    this.props.setSelectedGender(genders);
  }

  getFilteredResults(items?: ?Array<Object>, exclude?: { [string]: boolean }) {
    const { rawData, selectedRace, selectedGender } = this.props;
    let x = exclude || {};
    const isMatch = item => {
      if (!x.selectedRace) {
        if (
          selectedRace &&
          selectedRace !== MotherJonesMassShootings.getRaceFromItem(item)
        ) {
          return false;
        }
      }
      const gender = item.gender.toLowerCase();
      if (
        !selectedGender.male &&
        (gender === "m" || !gender.includes("female"))
      ) {
        return false;
      }
      if (!selectedGender.female && gender.includes("female")) {
        return false;
      }
      return true;
    };
    return items ? items.filter(isMatch) : rawData.filter(isMatch);
  }

  static renderIncident(incident, key) {
    return (
      <IncidentContainer key={key}>
        <H2>{incident.case}</H2>
        <P>{incident.moment.format("MMMM DD, YYYY")}</P>
        <P>{incident.summary}</P>
      </IncidentContainer>
    );
  }
}

const mapStateToProps = state => ({
  rawData: state.motherJonesData.data,
  data: state.motherJonesData.filteredData,
  selectedState: state.motherJonesData.selectedState,
  selectedRace: state.motherJonesData.selectedRace,
  selectedGender: state.motherJonesData.selectedGender
});

const mapDispatchToProps = {
  ...motherJonesActions
};

export default connect(mapStateToProps, mapDispatchToProps)(
  MotherJonesMassShootings
);
