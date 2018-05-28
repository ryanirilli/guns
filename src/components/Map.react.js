// @flow
import * as React from 'react';
import styled from 'styled-components';
import DeckGL, {GeoJsonLayer, IconLayer} from 'deck.gl';
import MapGL from 'react-map-gl';
import GunImage from '../images/gun@2x.png';
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

type State = {
  viewport: {
    width: number,
    height: number,
    longitude: number,
    latitude: number,
    zoom: number,
    pitch: number,
    bearing: number
  },
  layers: Array<GeoJsonLayer>
}

type Props = {
  data: Object,
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;  
`;

class Map extends React.Component<Props, State> {
  containerEl = null;

  state: State = {
    viewport: {
      width: 0,
      height: 0,
      longitude: -122.3321,
      latitude: 47.6062,
      zoom: 11,
      pitch: 0,
      bearing: 0,
    },
    layers: []
  };

  componentDidMount(): void {
    const {containerEl} = this;
    if (containerEl == null) {
      return;
    }
    const {viewport} = this.state;
    const {width, height} = containerEl.getBoundingClientRect();
    const vp = {...viewport, width, height};
    this.setState({viewport: vp});
    const ro = new window.ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect;
      const vp = {...viewport, width, height};
      this.setState({viewport: vp});
    });
    ro.observe(containerEl);
  }

  static isGunCrime(d: Object): boolean {
    const {initial_type_description, event_clearance_subgroup, initial_type_group} = d.properties;
    return (initial_type_description && initial_type_description.includes('GUN')) ||
      (event_clearance_subgroup && event_clearance_subgroup.includes('GUN')) ||
      (initial_type_group && initial_type_group.includes('GUN'));
  }

  static getDerivedStateFromProps(props: Props) {
    const {data} = props;
    if (!data.features.length) {
      return null;
    }

    const baseLayer = new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: false,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: d => {
        if (Map.isGunCrime(d)) {
          return [175, 73, 73, 0];
        }
        return [197, 197, 197, 100];
      },
      getRadius: d => 40,
      getLineWidth: d => 1,
      getElevation: d => 30,
    });

    const gunLayer = new IconLayer({
      id: 'icon-layer',
      data: data.features.filter(Map.isGunCrime),
      pickable: true,
      iconAtlas: GunImage,
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 36,
          height: 26,
          anchorY: 5,
          mask: true
        }
      },
      sizeScale: 10,
      getPosition: d => d.geometry.coordinates,
      getIcon: d => 'marker',
      getSize: d => 5,
      getColor: d => [186, 42, 61, 255],
      onClick(info) {
        console.log(info);
      }
    });
    return {layers: [baseLayer, gunLayer]};
  }

  render(): React.Node {
    const {viewport, layers} = this.state;
    return <Container innerRef={el => this.containerEl = el}>
      <MapGL mapStyle="mapbox://styles/ryanirilli1/cjhqtnbjf6adz2rpf3abo5csf"
             onViewportChange={(viewport) => this.setState({viewport})}
             {...viewport}
             mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
        <DeckGL {...viewport} layers={layers} />
      </MapGL>
    </Container>
  }
}

export default Map;