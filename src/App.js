// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Map from './components/Map.react';
import MapMainContent from './components/MapMainContent.react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;  
  position: relative;
`;

type Props = {}

type State = {
  layersData: Object
}

class App extends Component<Props, State> {
  state: State = {
    layersData: {
      "type": "FeatureCollection",
      "features": []
    }
  };

  async componentDidMount() {
    const res = await fetch('https://data.seattle.gov/resource/pu5n-trf4.json?$where=at_scene_time IS NOT NULL&$order=at_scene_time DESC');
    const data = await res.json();
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

    this.setState({layersData});
  };

  render() {
    return (
      <Container>
        <MapMainContent />
        <Map data={this.state.layersData} />
      </Container>
    );
  }
}

export default App;
