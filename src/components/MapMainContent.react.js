// @flow
import * as React from 'react';
import styled from 'styled-components';

import {H2} from '../styles/Headings';
import {PadMain} from '../styles/Padding';

const Container = styled.div`
  position: absolute;
  width: 400px;  
  background: #f5f5f5;
  left: 32px;
  top: 32px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  overflow: hidden;
`;

const Footer = styled.div`
  font-size: 12px;
  padding: 8px;
  background: #e4e4e4;
  border-top: 1px solid #d2d2d2;
  a {
    color: black;
  }
`;

type Props = {
  children: ?React.Node | ?Array<React.Node>
}

class MapMainContent extends React.Component<Props> {
  render() {
    return <Container>
      <PadMain>
        <H2>Seattle Police Department <span>911 Incident Response</span></H2>
        {this.props.children}
      </PadMain>
      <Footer>
        <div>
          Data Source: <a href="https://data.seattle.gov/Public-Safety/Seattle-Police-Department-911-Incident-Response/3k2p-39jp" target="_blank">
            Seattle Open Data Program
          </a>
        </div>
        <div>
          Made by <a href="https://github.com/ryanirilli/guns" target="_blank">Ryan Irilli</a> using <a href="http://uber.github.io/deck.gl" target="_blank">Deck.GL</a>
        </div>
      </Footer>
    </Container>
  }
}

export default MapMainContent;