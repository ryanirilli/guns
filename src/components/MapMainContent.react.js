// @flow
import * as React from 'react';
import styled from 'styled-components';

import {H2} from '../styles/Headings';
import {PadMain} from '../styles/Padding';

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
  background: linear-gradient(to right, #009fff, #ec2f4b);;
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

type Props = {
  children: ?React.Node | ?Array<React.Node>
}

class MapMainContent extends React.Component<Props> {
  render() {
    return <Container>
      <Header>
        <PadMain>
          <H2>Seattle Police Department <span>911 Incident Response</span></H2>
          {this.props.children}
        </PadMain>
      </Header>
      <BodyContent>
        <PadMain>
          <p style={{marginTop: 0}}>Every major city has to deal with crime, and in particular, gun related incidents.
          Seattle is no different and as our city continues to grow, it is important to understand where
            crime rates are changing to help guide how we allocate our law enforcement resources.</p>
          <p style={{marginBottom: 0}}>
            This visualization plots the first 10K results of 911 incident responses by year. Use the slider to see how
            crime rates are changing in Seattle and what neighborhoods are most impacted.
          </p>
        </PadMain>
      </BodyContent>
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