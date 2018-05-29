// @flow
import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import Map from './components/Map.react';
import MapMainContent from './components/MapMainContent.react';
import Checkbox from './components/Checkbox.react';
import Slider from 'rc-slider';

const Container = styled.div`
  width: 100vw;
  height: 100vh;  
  position: relative;
`;

const CheckboxContainer = styled.div`
  margin-top: 20px;  
`;

const SliderContainer = styled.div`
  margin-top: 4px;
  .rc-slider-track {
    background: white;
  }
  .rc-slider-rail {
    background: rgba(255,255,255,0.15);
  }
  .rc-slider-handle {
    border-color: white;
  }
`;

const CurrentYear = styled.div`
  text-align: left;
  font-weight: 800;
  font-size: 20px;
  margin-top: 24px;
`;

type Props = {}

type State = {
  layersData: Object,
  startYear: number,
  cache: Object,
  showGunLayer: boolean,
  showAllOtherCrime: boolean,
}

class App extends Component<Props, State> {
  state: State = {
    layersData: {
      "type": "FeatureCollection",
      "features": []
    },
    startYear: 2017,
    cache: {},
    showGunLayer: true,
    showAllOtherCrime: true,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.startYear !== prevState.startYear) {
      this.fetchData();
    }
  }

  async fetchData() {
    const {startYear, cache} = this.state;
    let data = cache[startYear];
    let updatedCache = {...cache};
    if (!data) {
      const res = await fetch(`https://data.seattle.gov/resource/pu5n-trf4.json?$where=at_scene_time IS NOT NULL AND at_scene_time > '${startYear}-01-01' AND at_scene_time < '${startYear+1}-12-31'&$order=at_scene_time DESC&$limit=10000`);
      data = await res.json();
      updatedCache[startYear] = data;
    }

    const features = data.map(item => {
      if (!item.incident_location.coordinates) {
        return null;
      }
      return {
        "type":"Feature",
        "geometry": item.incident_location,
        properties: item
      }
    }).filter(item => Boolean(item));

    const layersData = {
      "type": "FeatureCollection",
      features
    };
    this.setState({layersData, cache: updatedCache});
  };

  render() {
    const {showGunLayer, showAllOtherCrime, startYear, layersData} = this.state;
    return (
      <Container>
        <MapMainContent>
          <CheckboxContainer>
            <Checkbox isChecked={showGunLayer}
                      label="Show gun related reports"
                      onToggle={val => this.setState({showGunLayer: val})} />
            <Checkbox isChecked={showAllOtherCrime}
                      label="Show all other crime"
                      onToggle={val => this.setState({showAllOtherCrime: val})} />
          </CheckboxContainer>
          <CurrentYear>{startYear}</CurrentYear>
          <SliderContainer>
            <Slider min={2010} max={2017}
                    defaultValue={2017}
                    onChange={val => this.setState({startYear: val})} />
          </SliderContainer>
        </MapMainContent>
        <Map data={layersData}
             showGunLayer={showGunLayer}
             showAllOtherCrime={showAllOtherCrime} />
      </Container>
    );
  }
}

export default App;
