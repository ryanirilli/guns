// @flow
import "rc-slider/assets/index.css";
import React, { Component } from "react";
import styled from "styled-components";
import WebFont from "webfontloader";
import MdPlayArrow from "react-icons/lib/md/play-arrow";

import Map from "./components/Map.react";
import MotherJonesMassShootings from "./components/MotherJonesMassShootings";

import { H1 } from "./styles/Headings";
import { Page } from "./styles/Layouts";

import Flag from "./images/flag.jpg";

const Intro = styled(Page)`
  background: url(${Flag}) no-repeat;
  background-size: cover;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 3rem;
    text-shadow: 0 10px 30px black;
  }
`;

const IntroContent = styled.div`
  text-align: center;
`;

const MapContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
`;

const GunImg = styled.img`
  max-width: 200px;
`;

const FlagImg = styled.img`
  filter: grayscale();
  width: 100%;
`;

const PlayArrow = styled(MdPlayArrow)`
  font-size: 5rem;
  :hover {
    color: #b92a18;
    cursor: pointer;
  }
`;

type Props = {};

type State = {
  isTypeKitLoaded: boolean
};

class App extends Component<Props, State> {
  state: State = {
    isTypeKitLoaded: false
  };

  componentDidMount() {
    WebFont.load({
      typekit: { id: "tvy0peo" },
      active: () => this.setState({ isTypeKitLoaded: true })
    });
  }

  render() {
    const { isTypeKitLoaded } = this.state;
    return (
      <div>
        {isTypeKitLoaded && (
          <React.Fragment>
            {/*<Intro>*/}
            {/*<IntroContent>*/}
            {/*<H1>An American Gun Story</H1>*/}
            {/*<PlayArrow />*/}
            {/*</IntroContent>*/}
            {/*</Intro>*/}
            <Page>
              <MotherJonesMassShootings />
            </Page>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
