// @flow
import * as React from "react";
import * as d3 from "d3";
import styled from "styled-components";
import { GeoJsonLayer } from "deck.gl";
import { connect } from "react-redux";
import isEqual from "react-fast-compare";
import { Range } from "rc-slider";
import anime from "animejs";
import {
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  HorizontalGridLines,
  AreaSeries
} from "react-vis";
import { PieChart, Pie, Cell } from "recharts";
import Color from "color";
import numbro from "numbro";
import idx from "idx";

import Map from "../components/Map.react";
import GenderIcon from "../components/GenderIcon.react";
import ClientRect from "../components/ClientRect.react";

import {
  activeColor,
  inactiveColor,
  primaryTextColor,
  mainBgColor
} from "../styles/Colors";
import "../../node_modules/react-vis/dist/style.css";
import { BASE_SPACING_UNIT } from "../styles/Foundation";
import { PadMain } from "../styles/Padding";
import { H1, H3, P, A } from "../styles/Headings";
import { AbsoluteFill, FlexFill } from "../styles/Layouts";

import * as motherJonesActions from "../actions/motherJonesMassShootings.actions";
import USStates from "../data/us-states";

const colorManager = Color(activeColor);
let summaryContainerEl = null;
let raceAndYearLabelsEl = null;
let filtersEl = null;
let prevSignsLabelsEl = null;
let titleContainerEl = null;

const yesColor = colorManager.hex();
const unknownColor = colorManager.lighten(0.6).hex();
const noColor = colorManager.darken(0.4).hex();
const COLORS = [unknownColor, yesColor, noColor];
const COLOR_LEGEND = COLORS.map((color, i) => {
  let name;
  switch (i) {
    case 0:
      name = "unclear";
      break;
    case 1:
      name = "yes";
      break;
    default:
      name = "no";
      break;
  }
  return {
    color,
    name
  };
});

const CONTENT_PADDING_MULTIPLIER = 0;

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const MapContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
  opacity: 0;
`;

const ContentContainer = styled.div`
  width: 50vw;
  transform: translateX(-100%);
  height: 100vh;
  background: ${mainBgColor};
  position: relative;
  box-shadow: 0 0 15px #dadada;
  overflow: hidden;
`;

const Content = styled(AbsoluteFill)`
  opacity: 0;
  a {
    color: ${primaryTextColor};
    :visited {
      color: ${primaryTextColor};
    }
  }
`;

const SelectedStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  left: 100%;
  top: 0%;
  color: ${primaryTextColor};
  position: absolute;
  z-index: 1;
  border-left: 1px solid ${inactiveColor};
`;

const SelectedStateContent = styled.div`
  overflow-y: scroll;
`;

const SelectedStateTitleContainer = styled.div`
  border-bottom: 1px solid ${inactiveColor};
`;

const SelectedStateTitle = styled.div`
  text-align: center;
`;

const SelectedStateIncidentsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SelectedStateIncidents = styled.div`
  border-left: 2px solid ${colorManager.lighten(0.5).hex()};
  padding-left: ${BASE_SPACING_UNIT * 6}px;
  position: relative;
  margin-bottom: ${BASE_SPACING_UNIT * 16}px;
  :after {
    content: "";
    width: ${BASE_SPACING_UNIT * 2}px;
    height: ${BASE_SPACING_UNIT * 2}px;
    border-radius: ${BASE_SPACING_UNIT * 2}px;
    position: absolute;
    background: ${mainBgColor};
    top: -${BASE_SPACING_UNIT * 2}px;
    left: -${BASE_SPACING_UNIT * 2}px;
    border: 2px solid ${activeColor};
  }
`;

const SelectedStateIncident = styled.div`
  margin-bottom: ${BASE_SPACING_UNIT * 16}px;
  position: relative;
  top: -${BASE_SPACING_UNIT * 5}px;
  max-width: 500px;
  :last-child {
    margin-bottom: 0;
  }
  :not(:first-child):after {
    content: "";
    width: ${BASE_SPACING_UNIT * 2}px;
    height: ${BASE_SPACING_UNIT * 2}px;
    border-radius: ${BASE_SPACING_UNIT * 2}px;
    position: absolute;
    background: ${mainBgColor};
    top: ${BASE_SPACING_UNIT}px;
    left: -${BASE_SPACING_UNIT * 8}px;
    border: 2px solid ${activeColor};
  }
`;

const GenderContainer = styled.div`
  display: grid;
  max-width: 100px;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
  > div {
    min-width: 44px;
    text-align: center;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const Width50 = styled.div`
  width: 50%;
`;

const SliderContainer = styled.div`
  margin-top: 4px;
  .rc-slider-track {
    background: ${activeColor};
  }
  .rc-slider-rail {
    background: ${inactiveColor};
  }
  .rc-slider-handle {
    border-color: ${activeColor};
    background: ${activeColor};
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  border: 1px solid ${inactiveColor};
  border-radius: 4px;
  background: #efedec;
  > div {
    border-right: 1px solid ${inactiveColor};
    :last-child {
      border-right: none;
    }
    padding: ${BASE_SPACING_UNIT}px 0;
    flex: 1;
    text-align: center;
  }
`;

const Stat = styled.div`
  font-weight: bold;
  font-size: 2rem;
  color: ${colorManager.lighten(0.3).hex()};
`;

const MainLabel = styled.span`
  color: ${colorManager.darken(0.5).hex()};
  font-weight: 100;
  font-size: 0.875rem;
  font-family: monospace;
`;

const ChartAlignPadding = styled.div`
  padding-left: ${BASE_SPACING_UNIT * 8}px;
  padding-right: ${BASE_SPACING_UNIT * 4}px;
`;

const LabelContainer = styled(FlexContainer)`
  text-align: center;
`;

const FiltersContainer = styled(FlexContainer)`
  text-align: center;
  padding: ${BASE_SPACING_UNIT * 3}px;
  border-top: 1px solid ${inactiveColor};
  border-bottom: 1px solid ${inactiveColor};
`;

const YearFilterContainer = styled(Width50)`
  padding-top: ${BASE_SPACING_UNIT * 3}px;
`;

const CenterLabel = styled(MainLabel)`
  text-align: center;
`;
const OverviewContainer = styled(PadMain)`
  height: calc(
    100vh - ${BASE_SPACING_UNIT * (CONTENT_PADDING_MULTIPLIER * 2)}px
  );
`;

const Dot = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background: ${props => props.color};
  margin-right: ${BASE_SPACING_UNIT}px;
  position: relative;
  top: ${BASE_SPACING_UNIT}px;
`;

const InlineBlock = styled.div`
  display: inline-block;
`;

const Legend = styled(FlexContainer)`
  justify-content: center;
`;

const TitleContainer = styled.div`
  color: ${primaryTextColor};
  text-align: center;
`;

const ResetFiltersContainer = styled.button`
  position: fixed;
  left: 25vw;
  transform: translateX(-50%);  
  bottom: 40px;
  z-index: 999;
  background: white;
  padding: 10px 20px;
  color: ${activeColor};
  display: inline-block;
  border-radius: 20px;
  margin-top: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  :hover {
    background ${inactiveColor}
  }
  :active {
    box-shadow: none;
    outline:0;
  }
  :focus {    
    outline:0;
  }
`;

type Props = {
  data: Array<Object>,
  data: Array<Object>,
  fetchData: () => void,
  selectedState: ?Object,
  setSelectedState: (?Object) => void,
  selectedRace: ?string,
  setSelectedRace: (?string) => void,
  setMotherJonesFilteredData: (Array<Object>) => void,
  selectedGender: Object,
  setSelectedGender: Object => void,
  selectedYearRange: Array<number>,
  setYearRange: (Array<number>) => void,
  prevSign: ?string,
  setPrevSign: (?string) => void,
  selectedVenue: ?string,
  setSelectedVenue: (?string) => void,
  resetFilters: () => void
};

type State = {
  summaryHeight: number,
  raceAndYearLabelsHeight: number,
  filtersHeight: number,
  prevSignsLabelsHeight: number,
  titleContainerHeight: number
};

class MotherJonesMassShootings extends React.Component<Props, State> {
  contentEl: ?HTMLDivElement;
  mapEl: ?HTMLDivElement;
  contentContainerEl: ?HTMLDivElement;
  resetFiltersEl: ?HTMLDivElement;

  state: State = {
    summaryHeight: 0,
    raceAndYearLabelsHeight: 0,
    filtersHeight: 0,
    prevSignsLabelsHeight: 0,
    titleContainerHeight: 0
  };

  componentDidMount() {
    this.props.fetchData();
  }

  static getDerivedStateFromProps(props) {
    const summaryHeight = summaryContainerEl
      ? summaryContainerEl.getBoundingClientRect().height
      : 0;
    const raceAndYearLabelsHeight = raceAndYearLabelsEl
      ? raceAndYearLabelsEl.getBoundingClientRect().height
      : 0;
    const filtersHeight = filtersEl
      ? filtersEl.getBoundingClientRect().height
      : 0;
    const prevSignsLabelsHeight = prevSignsLabelsEl
      ? prevSignsLabelsEl.getBoundingClientRect().height
      : 0;
    const titleContainerHeight = titleContainerEl
      ? titleContainerEl.getBoundingClientRect().height
      : 0;
    return {
      summaryHeight,
      raceAndYearLabelsHeight,
      filtersHeight,
      prevSignsLabelsHeight,
      titleContainerHeight
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedState, data } = this.props;
    const prevData = prevProps.data;
    const prevSelectedState = prevProps.selectedState;
    if (!isEqual(selectedState, prevSelectedState)) {
      if (selectedState && prevSelectedState == null) {
        this.contentTransition(true);
      }
    }
    if (data.length && !prevData.length) {
      this.animateIn();
    }
  }

  async animateIn() {
    const { contentEl, mapEl, contentContainerEl } = this;
    await anime({
      targets: contentContainerEl,
      easing: "easeOutCubic",
      duration: 1000,
      opacity: [0, 1],
      translateX: ["-10%", 0]
    }).finished;
    anime({
      targets: contentEl,
      opacity: [0, 1],
      easing: "easeOutCubic",
      duration: 1300,
      translateY: [20, 0]
    });
    anime({
      targets: mapEl,
      opacity: [0, 1],
      easing: "easeOutCubic",
      duration: 1300,
      delay: 200,
      translateY: [20, 0]
    });
  }

  render(): React.Node {
    return (
      <Container>
        <MapContainer innerRef={el => (this.mapEl = el)}>
          {this.renderMap()}
        </MapContainer>
        <ContentContainer innerRef={el => (this.contentContainerEl = el)}>
          {this.renderResetFilters()}
          <Content innerRef={el => (this.contentEl = el)}>
            {this.renderSelectedState()}
            {this.renderOverview()}
          </Content>
        </ContentContainer>
      </Container>
    );
  }

  renderOverview() {
    return (
      <OverviewContainer base={BASE_SPACING_UNIT * CONTENT_PADDING_MULTIPLIER}>
        <ClientRect
          container={FlexFill}
          render={cr => {
            const {
              summaryHeight,
              raceAndYearLabelsHeight,
              filtersHeight,
              prevSignsLabelsHeight,
              titleContainerHeight
            } = this.state;
            const chartHeight =
              (cr.height -
                summaryHeight -
                raceAndYearLabelsHeight -
                filtersHeight -
                titleContainerHeight -
                prevSignsLabelsHeight) /
                2 -
              60;
            return (
              <div>
                <TitleContainer innerRef={el => (titleContainerEl = el)}>
                  <PadMain top={BASE_SPACING_UNIT * 4} bottom={0}>
                    <H1>Mass shootings in America</H1>
                    <P>
                      1982 to 2018 Data provided by{" "}
                      <A
                        href="https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/"
                        target="_blank"
                      >
                        Mother Jones
                      </A>
                    </P>
                  </PadMain>
                </TitleContainer>
                {this.renderSummary()}
                <PadMain
                  innerRef={el => (raceAndYearLabelsEl = el)}
                  top={BASE_SPACING_UNIT * 4}
                  left={0}
                  right={0}
                  bottom={0}
                >
                  <LabelContainer>
                    <Width50>
                      <CenterLabel>Shooter Demographics</CenterLabel>
                    </Width50>
                    <Width50>
                      <CenterLabel>Incidents Per Year</CenterLabel>
                    </Width50>
                  </LabelContainer>
                </PadMain>
                {this.renderRaceAndYearCharts(chartHeight)}

                <FiltersContainer innerRef={el => (filtersEl = el)}>
                  <Width50>{this.renderGenderSelector()}</Width50>
                  <YearFilterContainer>
                    {this.renderYearSlider()}
                  </YearFilterContainer>
                </FiltersContainer>

                <PadMain
                  top={BASE_SPACING_UNIT * 4}
                  left={0}
                  right={0}
                  bottom={0}
                >
                  <LabelContainer innerRef={el => (prevSignsLabelsEl = el)}>
                    <Width50>
                      <CenterLabel>
                        Previous Signs of Mental Illness
                      </CenterLabel>
                      <Legend>
                        <div>
                          {COLOR_LEGEND.map((item, i) => {
                            return (
                              <InlineBlock key={i}>
                                <PadMain
                                  top={0}
                                  right={BASE_SPACING_UNIT * 4}
                                  bottom={0}
                                  left={0}
                                >
                                  <Dot color={this.getColor(item)} />
                                  <MainLabel>{item.name}</MainLabel>
                                </PadMain>
                              </InlineBlock>
                            );
                          })}
                        </div>
                      </Legend>
                    </Width50>
                    <Width50>
                      <CenterLabel>Venue</CenterLabel>
                    </Width50>
                  </LabelContainer>
                </PadMain>
                <FlexContainer>
                  <ClientRect
                    container={Width50}
                    render={cr => this.renderMentalHealthChart(cr, chartHeight)}
                  />
                  <ClientRect
                    container={Width50}
                    render={cr => this.renderVenueChart(cr, chartHeight)}
                  />
                </FlexContainer>
              </div>
            );
          }}
        />
      </OverviewContainer>
    );
  }

  getColor(item) {
    const { prevSign } = this.props;
    if (!prevSign) {
      return item.color;
    }
    return prevSign === item.name ? item.color : inactiveColor;
  }

  renderResetFilters() {
    return (
      <ResetFiltersContainer
        innerRef={el => (this.resetFiltersEl = el)}
        onClick={e => {
          e.preventDefault();
          this.props.resetFilters();
          return false;
        }}
      >
        Reset Filters
      </ResetFiltersContainer>
    );
  }

  renderMap() {
    const { selectedState } = this.props;
    const data = this.getFilteredResults();
    const massShootingsByState = d3
      .nest()
      .key(d => d.stateName)
      .entries(data);
    const minNumIncidents = d3.min(massShootingsByState, d => d.values.length);
    const maxNumIncidents = d3.max(massShootingsByState, d => d.values.length);
    const colorScale = d3
      .scaleLinear()
      .domain([minNumIncidents, maxNumIncidents / 2, maxNumIncidents])
      .range([
        colorManager.lighten(0.5).hex(),
        colorManager.lighten(0.25).hex(),
        colorManager.hex()
      ]);
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
          let vals = colorScale(val.values.length);
          vals = vals.split("rgb(").filter(item => Boolean(item))[0];
          vals = vals
            .substr(0, vals.length - 1)
            .split(",")
            .map(v => parseInt(v, 10));
          vals.push(255);
          color = vals;
        }
        if (val && val.key === idx(this.props, _ => _.selectedState.key)) {
          color = [0, 0, 0, 255];
        }
        return color;
      },
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 5000,
      onClick: state => {
        this.setSelectedState(state, selectedState, massShootingsByState);
      },
      updateTriggers: {
        getFillColor: [selectedState, data]
      }
    });
    return <Map layers={[layer]} />;
  }

  async setSelectedState(
    state: Object,
    selectedState: ?Object,
    massShootingsByState: Array<Object>
  ) {
    const _selectedState = massShootingsByState.find(
      item => item.key === state.object.properties.name
    );

    const selected = isEqual(selectedState, _selectedState)
      ? null
      : _selectedState;

    if (!selected) {
      await this.contentTransition();
    }

    this.props.setSelectedState(selected);
  }

  renderYearSlider(): React.Node {
    const { data, selectedYearRange } = this.props;
    const minYear = parseInt(d3.min(data, d => d.moment.format("YYYY")), 10);
    const maxYear = parseInt(d3.max(data, d => d.moment.format("YYYY")), 10);
    if (!minYear || !maxYear) {
      return null;
    }
    const EndYear = styled(Width50)`
      text-align: right;
    `;
    const StartYear = styled(Width50)`
      text-align: left;
    `;
    return (
      <ChartAlignPadding>
        <SliderContainer>
          <Range
            min={minYear}
            max={maxYear}
            pushable={1}
            value={selectedYearRange}
            defaultValue={[minYear, maxYear]}
            onChange={this.props.setYearRange}
          />
        </SliderContainer>
        <FlexContainer>
          <StartYear>
            <MainLabel>{selectedYearRange[0]}</MainLabel>
          </StartYear>
          <EndYear>
            <MainLabel>{selectedYearRange[1]}</MainLabel>
          </EndYear>
        </FlexContainer>
      </ChartAlignPadding>
    );
  }

  renderRaceAndYearCharts(chartHeight: number) {
    return (
      <PadMain
        top={0}
        left={BASE_SPACING_UNIT * 8}
        right={BASE_SPACING_UNIT * 8}
        bottom={0}
      >
        <FlexContainer>
          <ClientRect
            container={Width50}
            render={cr => this.renderRaceGraph(cr, chartHeight)}
          />
          <ClientRect
            container={Width50}
            render={cr => this.renderYearLineChart(cr, chartHeight)}
          />
        </FlexContainer>
      </PadMain>
    );
  }

  renderGenderSelector() {
    const { selectedGender } = this.props;
    const GenderWrapper = styled(ChartAlignPadding)`
      display: flex;
      justify-content: center;
    `;
    return (
      <GenderWrapper>
        <GenderContainer>
          <div>
            <MainLabel>Male</MainLabel>
            <GenderIcon
              onClick={e => this.toggleGender("male")}
              gender="male"
              isActive={selectedGender.male}
            />
          </div>
          <div>
            <MainLabel>female</MainLabel>
            <GenderIcon
              onClick={e => this.toggleGender("female")}
              isActive={selectedGender.female}
            />
          </div>
        </GenderContainer>
      </GenderWrapper>
    );
  }

  renderRaceGraph = (clientRect: Object, chartHeight: number) => {
    const { selectedRace, data } = this.props;
    const massShootingsByRace = d3
      .nest()
      .key(d => MotherJonesMassShootings.getRaceFromItem(d))
      .entries(data);

    const raceData = massShootingsByRace.map(item => {
      const results = this.getFilteredResults(item.values, {
        selectedRace: true
      });
      return {
        x: item.key === "native american" ? "native" : item.key,
        y: results.length,
        color: selectedRace
          ? item.key === selectedRace ? activeColor : inactiveColor
          : activeColor
      };
    });
    return (
      <div>
        <XYPlot
          yDomain={[0, d3.max(massShootingsByRace, item => item.values.length)]}
          margin={{ left: 30 }}
          height={
            clientRect.width / 1.2 > chartHeight
              ? chartHeight
              : clientRect.width / 1.2
          }
          width={clientRect.width}
          xType={"ordinal"}
        >
          <XAxis />
          <YAxis />
          <HorizontalGridLines />
          <VerticalBarSeries
            colorType="literal"
            data={raceData}
            onValueClick={this.handleRaceSelect}
          />
        </XYPlot>
      </div>
    );
  };

  renderVenueChart = (clientRect: Object, chartHeight: number) => {
    const { data, selectedVenue } = this.props;
    const venues = d3
      .nest()
      .key(d => {
        let val = d.venue.toLowerCase();
        val = val.includes("workplace") ? "workplace" : val;
        val = val.includes("other") ? "other" : val;
        return val;
      })
      .entries(data);
    if (!venues.length) {
      return null;
    }
    const _data = venues.map(item => {
      const results = this.getFilteredResults(item.values, {
        selectedVenue: true
      });
      return {
        x: item.key,
        y: results.length,
        color: selectedVenue
          ? item.key === selectedVenue ? activeColor : inactiveColor
          : activeColor
      };
    });
    return (
      <div>
        <XYPlot
          yDomain={[0, d3.max(venues, item => item.values.length)]}
          margin={{ left: 30 }}
          height={
            clientRect.width / 1.2 > chartHeight
              ? chartHeight
              : clientRect.width / 1.2
          }
          width={clientRect.width}
          xType={"ordinal"}
        >
          <XAxis />
          <YAxis />
          <HorizontalGridLines />
          <VerticalBarSeries
            colorType="literal"
            data={_data}
            onValueClick={this.handleVenueSelect}
          />
        </XYPlot>
      </div>
    );
  };

  renderMentalHealthChart = (clientRect: Object, chartHeight: number) => {
    const { data, setPrevSign, prevSign } = this.props;
    const prevSignsOfMentalHealth = d3
      .nest()
      .key(d => {
        let key = d["prior signs of mental health issues"].trim().toLowerCase();
        return key === "unclear" ||
          key === "-" ||
          key === "unknown" ||
          key === "tbd"
          ? "unclear"
          : key;
      })
      .entries(data);
    if (!prevSignsOfMentalHealth.length) {
      return null;
    }
    const _data = prevSignsOfMentalHealth.map(item => {
      const value = this.getFilteredResults(item.values, {
        prevSign: true
      }).length;
      return {
        name: item.key,
        value
      };
    });
    return (
      <PieChart
        width={clientRect.width}
        height={clientRect.width > chartHeight ? chartHeight : clientRect.width}
      >
        <Pie
          data={_data}
          dataKey="value"
          outerRadius={
            clientRect.width > chartHeight
              ? chartHeight / 2.5
              : clientRect.width / 2.5
          }
          innerRadius={
            clientRect.width > chartHeight
              ? chartHeight / 5
              : clientRect.width / 5
          }
          isAnimationActive={false}
        >
          {_data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                prevSign
                  ? entry.name === prevSign ? COLORS[index] : inactiveColor
                  : COLORS[index]
              }
              onClick={e =>
                setPrevSign(
                  _data[index].name === prevSign ? null : _data[index].name
                )
              }
            />
          ))}
        </Pie>
      </PieChart>
    );
  };

  renderYearLineChart = (clientRect: Object, chartHeight: number) => {
    const { data } = this.props;
    const massShootingsByYear = d3
      .nest()
      .key(d => d.moment.format("YYYY"))
      .entries(data);
    const yearDataFilteredBySelectedYearRange = massShootingsByYear.map(
      item => {
        const results = this.getFilteredResults(item.values);
        return {
          y: results.length,
          x: item.key
        };
      }
    );
    const yearData = massShootingsByYear.map(item => {
      const results = this.getFilteredResults(item.values, {
        selectedYearRange: true
      });
      return {
        y: results.length,
        x: item.key
      };
    });
    return (
      <div>
        <XYPlot
          height={
            clientRect.width / 1.2 > chartHeight
              ? chartHeight
              : clientRect.width / 1.2
          }
          width={clientRect.width}
          xDomain={[
            parseInt(d3.min(data, d => d.moment.format("YYYY")), 10),
            parseInt(d3.max(data, d => d.moment.format("YYYY")), 10)
          ]}
          yDomain={[0, d3.max(massShootingsByYear, d => d.values.length)]}
        >
          <HorizontalGridLines />
          <XAxis tickFormat={v => `${v}`} />
          <YAxis />
          <AreaSeries
            animation
            data={yearData}
            fill={inactiveColor}
            stroke={inactiveColor}
          />
          <AreaSeries
            animation
            data={yearDataFilteredBySelectedYearRange}
            fill={activeColor}
            stroke={activeColor}
          />
        </XYPlot>
      </div>
    );
  };

  renderSummary() {
    return (
      <PadMain bottom={0} innerRef={el => (summaryContainerEl = el)}>
        <SummaryContainer>
          <div>
            <MainLabel>Incidents</MainLabel>
            <Stat>
              {this.formatNumber(d3.sum(this.getFilteredResults(), d => 1))}
            </Stat>
          </div>
          <div>
            <MainLabel>Fatalaties</MainLabel>
            <Stat>
              {this.formatNumber(
                d3.sum(this.getFilteredResults(), d => d.fatalities)
              )}
            </Stat>
          </div>
          <div>
            <MainLabel>Injured</MainLabel>
            <Stat>
              {this.formatNumber(
                d3.sum(this.getFilteredResults(), d => d.injured)
              )}
            </Stat>
          </div>
        </SummaryContainer>
      </PadMain>
    );
  }

  formatNumber(number: number): string {
    return numbro(number).format({
      thousandSeparated: true
    });
  }

  handleRaceSelect = (datapoint): void => {
    const { selectedRace } = this.props;
    let race = datapoint.x === "native" ? "native american" : datapoint.x;
    race = race === selectedRace ? null : race;
    this.props.setSelectedRace(race);
  };

  handleVenueSelect = (datapoint): void => {
    const { selectedVenue } = this.props;
    let venue = datapoint.x;
    venue = venue === selectedVenue ? null : venue;
    this.props.setSelectedVenue(venue);
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
        <SelectedStateTitleContainer>
          <PadMain left={BASE_SPACING_UNIT * 10}>
            <SelectedStateTitle>
              <H1>{selectedState.key}</H1>
            </SelectedStateTitle>
          </PadMain>
        </SelectedStateTitleContainer>
        <SelectedStateContent>
          <PadMain left={BASE_SPACING_UNIT * 10} top={BASE_SPACING_UNIT * 10}>
            <SelectedStateIncidentsContainer>
              <SelectedStateIncidents>
                {incidents.map((incident, i) =>
                  MotherJonesMassShootings.renderIncident(incident, i)
                )}
              </SelectedStateIncidents>
            </SelectedStateIncidentsContainer>
          </PadMain>
        </SelectedStateContent>
      </SelectedStateContainer>
    );
  }

  static renderIncident(incident, key) {
    return (
      <SelectedStateIncident key={key}>
        <P>{incident.moment.format("MMMM DD, YYYY")}</P>
        <H3>{incident.case}</H3>
        <P>{incident.summary}</P>
      </SelectedStateIncident>
    );
  }

  toggleGender(gender: string): void {
    const genders = { ...this.props.selectedGender };
    genders[gender] = !genders[gender];
    this.props.setSelectedGender(genders);
  }

  getFilteredResults(
    items?: ?Array<Object>,
    excludes?: { [string]: boolean } = {}
  ) {
    const {
      data,
      selectedRace,
      selectedGender,
      selectedYearRange,
      prevSign,
      selectedVenue
    } = this.props;
    const isMatch = item => {
      const year = parseInt(item.moment.format("YYYY"), 10);
      if (!excludes.selectedRace) {
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
      if (
        !excludes.selectedYearRange &&
        selectedYearRange &&
        (year < selectedYearRange[0] || year > selectedYearRange[1])
      ) {
        return false;
      }
      if (!excludes.prevSign && prevSign) {
        let sign = item["prior signs of mental health issues"]
          .trim()
          .toLowerCase();
        sign =
          sign === "unclear" ||
          sign === "-" ||
          sign === "unknown" ||
          sign === "tbd"
            ? "unclear"
            : sign;
        if (sign !== prevSign) {
          return false;
        }
      }
      if (!excludes.selectedVenue && selectedVenue) {
        let venue = item.venue.trim().toLowerCase();
        venue = venue.includes("workplace") ? "workplace" : venue;
        venue = venue.includes("other") ? "other" : venue;
        if (venue !== selectedVenue) {
          return false;
        }
      }
      return true;
    };
    return items ? items.filter(isMatch) : data.filter(isMatch);
  }

  async contentTransition(direction?: boolean) {
    const { contentEl, resetFiltersEl } = this;
    if (!contentEl || !resetFiltersEl) {
      return;
    }
    const vals = [0, "-100%"];
    const opacity = [1, 0];
    anime({
      targets: resetFiltersEl,
      opacity: direction ? opacity : opacity.reverse(),
      duration: 500,
      easing: "easeInOutCubic"
    });
    return anime({
      targets: contentEl,
      translateX: direction ? vals : vals.reverse(),
      duration: 1000,
      easing: "easeInOutCubic"
    }).finished;
  }
}

const mapStateToProps = state => ({
  ...state.motherJonesData
});

const mapDispatchToProps = {
  ...motherJonesActions
};

export default connect(mapStateToProps, mapDispatchToProps)(
  MotherJonesMassShootings
);
