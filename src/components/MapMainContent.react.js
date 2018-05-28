// @flow
import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  width: 500px;
  min-height: 300px;
  background: white;
  left: 32px;
  top: 32px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
`;

class MapMainContent extends React.Component<{}> {
  render() {
    return <Container/>
  }
}

export default MapMainContent;