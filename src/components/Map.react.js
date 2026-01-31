
import * as React from "react";
import styled from "styled-components";
import DeckGL from "deck.gl";
import MapGL from "react-map-gl";
import ResizeObserver from "resize-observer-polyfill";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;



const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

class Map extends React.Component {
  containerEl = null;

  static defaultProps = {
    layers: []
  };

  state = {
    resizeObserver: null,
    viewport: {
      width: 0,
      height: 0,
      longitude: -98.5795,
      latitude: 39.8283,
      zoom: 3,
      pitch: 0,
      bearing: 0
    },
    layers: []
  };

  componentDidMount() {
    const { containerEl } = this;
    if (containerEl == null) {
      return;
    }
    const { viewport } = this.state;
    const { width, height } = containerEl.getBoundingClientRect();
    const vp = { ...viewport, width, height };
    this.setState({ viewport: vp });
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const vp = { ...viewport, width, height };
      this.setState({ viewport: vp });
    });
    ro.observe(containerEl);
    this.setState({ resizeObserver: ro });
  }

  componentWillUnmount() {
    const { resizeObserver } = this.state;
    resizeObserver && resizeObserver.disconnect();
  }

  render() {
    const { layers } = this.props;
    const { viewport } = this.state;
    return (
      <Container innerRef={el => (this.containerEl = el)}>
        <MapGL
          mapStyle="mapbox://styles/ryanirilli1/cjhzg4zm52r682smigarxdl6f"
          onViewportChange={viewport => this.setState({ viewport })}
          {...viewport}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          <DeckGL {...viewport} layers={layers} />
        </MapGL>
      </Container>
    );
  }
}

export default Map;
