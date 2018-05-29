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
    </Container>
  }
}

export default MapMainContent;