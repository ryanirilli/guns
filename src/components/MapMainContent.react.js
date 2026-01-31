
import * as React from "react";
import styled from "styled-components";

import { H2 } from "../styles/Headings";
import { PadMain } from "../styles/Padding";

const Container = styled.div`
  position: absolute;
  width: 400px;
  background: white;
  color: white;
  left: 32px;
  top: 32px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(to right, #009fff, #ec2f4b);
  color: white;
`;

const BodyContent = styled.div`
  color: black;
  font-size: 12px;
`;

const Footer = styled.div`
  font-size: 12px;
  padding: 8px;
  background: #f7f7f7;
  color: #9c9c9c;
  border-top: 1px solid #e6e6e6;
  a {
    color: #9c9c9c;
  }
`;



class MapMainContent extends React.Component {
  render() {
    return <Container />;
  }
}

export default MapMainContent;
