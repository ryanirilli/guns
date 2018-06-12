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
import { H1, P, A } from "./styles/Headings";
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
    const SecondParagraph = styled(P)`
      margin-top: 20px;
    `;
    const MjLink = styled(A)`
      color: white;
      :visited {
        color: white;
      }
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
                    Mass shootings in America
                  </H1>
                  <IntroText innerRef={el => (this.contentEl = el)}>
                    <P>
                      America has a long and storied past with guns and gun
                      violence. Mass shootings are a grave reminder of the cost
                      of that freedom we fight so hard to uphold. Responsible
                      gun owners will argue tooth and nail for their rights to
                      legally bear arms, but as laws remain unchanged, these
                      tragedies continue to occur more and more in our country.
                    </P>
                    <SecondParagraph>
                      <MjLink
                        href="https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/"
                        target="_blank"
                      >
                        Mother Jones
                      </MjLink>{" "}
                      has published a full data set from their in-depth
                      investigation into mass shootings from 1982-2018.
                    </SecondParagraph>
                  </IntroText>
                  <div>
                    <GoToDataButton
                      onClick={this.showDashboard}
                      innerRef={el => (this.goToDataButtonEl = el)}
                    >
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
      duration: 1000
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
