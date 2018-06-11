// @flow
import "rc-slider/assets/index.css";
import React, { Component } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import anime from "animejs";
import WebFont from "webfontloader";
import MdPlayArrow from "react-icons/lib/md/play-arrow";

import Map from "./components/Map.react";
import MotherJonesMassShootings from "./components/MotherJonesMassShootings";

import { AbsoluteFill } from "./styles/Layouts";
import { H1, P } from "./styles/Headings";
import { Page } from "./styles/Layouts";
import { activeColor, mainBgColor, inactiveColor } from "./styles/Colors";

import MainBg from "./images/samuel-branch-442129-unsplash.jpg";

const Intro = styled(Page)`
  background: url(${MainBg}) no-repeat;
  background-size: cover;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  h1 {
    font-size: 3rem;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const IntroContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
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

const GoToDataButton = styled.button`
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

type Props = {};

type State = {
  isTypeKitLoaded: boolean,
  hasIntroLoaded: boolean,
  isShowingDashboard: boolean
};

class App extends Component<Props, State> {
  hasAnimatedIn: boolean;
  mainBgEl: ?HTMLDivElement;
  titleEl: ?HTMLElement;
  contentEl: ?HTMLElement;
  goToDataButtonEl: ?HTMLElement;

  state: State = {
    isTypeKitLoaded: false,
    hasIntroLoaded: false,
    isShowingDashboard: false
  };

  componentDidMount() {
    WebFont.load({
      typekit: { id: "tvy0peo" },
      active: () => this.setState({ isTypeKitLoaded: true })
    });
    const mainBg = document.createElement("img");
    mainBg.src = MainBg;
    mainBg.onload = () => {
      setTimeout(() => {
        this.setState({ hasIntroLoaded: true });
      }, 2000);
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { hasIntroLoaded, isTypeKitLoaded } = this.state;
    if (hasIntroLoaded && isTypeKitLoaded && !this.hasAnimatedIn) {
      this.animateIn();
    }
  }

  render() {
    const { isTypeKitLoaded, isShowingDashboard, hasIntroLoaded } = this.state;
    const IntroText = styled(P)`
      max-width: 500px;
      align-self: center;
    `;
    return (
      <div>
        {!isTypeKitLoaded || !hasIntroLoaded ? (
          this.renderLoading()
        ) : (
          <React.Fragment>
            {!isShowingDashboard ? (
              <Intro innerRef={el => (this.mainBgEl = el)}>
                <IntroContent>
                  <H1 innerRef={el => (this.titleEl = el)}>
                    An American Gun Story
                  </H1>
                  <IntroText innerRef={el => (this.contentEl = el)}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas ac odio nulla. Donec non mauris vel libero
                    tincidunt pretium eget ut tortor. Nulla venenatis tincidunt
                    ultrices. Sed varius nunc odio, et lacinia sem gravida sed.
                    Integer faucibus vitae turpis quis rhoncus. Mauris sed
                    rutrum quam, a convallis lacus. Ut egestas, sapien in auctor
                    pretium, orci nunc bibendum enim, nec tempus nunc lectus
                    vitae purus. Donec et tortor turpis. Proin vitae porta
                    lacus.
                  </IntroText>
                  <div>
                    <GoToDataButton onClick={this.showDashboard} innerRef={el => (this.goToDataButtonEl = el)}>
                      Explore the Data
                    </GoToDataButton>
                  </div>
                </IntroContent>
              </Intro>
            ) : (
              <Page>
                <MotherJonesMassShootings />
              </Page>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }

  renderLoading() {
    const SpinnerContainer = styled(AbsoluteFill)`
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${mainBgColor};
    `;
    return (
      <SpinnerContainer>
        <div>
          <BarLoader color={activeColor} />
        </div>
      </SpinnerContainer>
    );
  }

  showDashboard = async () => {
    const { mainBgEl, titleEl, contentEl, goToDataButtonEl } = this;
    anime({
      targets: goToDataButtonEl,
      opacity: [1, 0],
      translateY: [0, 20],
      easing: "easeOutCubic",
      duration: 1000,      
    });
    anime({
      targets: contentEl,
      opacity: [1, 0],
      translateY: [0, 20],
      easing: "easeOutCubic",
      duration: 1000,
      delay: 500
    });
    anime({
      targets: titleEl,
      opacity: [1, 0],
      translateY: [0, 20],
      easing: "easeOutCubic",
      duration: 1000,
      delay: 600
    });
    await anime({
      targets: mainBgEl,
      opacity: [1, 0],
      easing: "easeInOutCubic",
      duration: 1000,
      delay: 800
    }).finished;
    this.setState({ isShowingDashboard: true });        
  };

  animateIn() {
    this.hasAnimatedIn = true;
    const { mainBgEl, titleEl, contentEl, goToDataButtonEl } = this;
    anime({
      targets: mainBgEl,
      opacity: [0, 1],
      easing: "easeInOutCubic",
      duration: 1000
    });
    anime({
      targets: titleEl,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutCubic",
      duration: 1000,
      delay: 500
    });
    anime({
      targets: contentEl,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutCubic",
      duration: 1000,
      delay: 600
    });
    anime({
      targets: goToDataButtonEl,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutCubic",
      duration: 1000,
      delay: 800
    });
  }
}

export default App;
