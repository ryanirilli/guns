// @flow
import * as React from 'react';
import styled from 'styled-components';

const Label = styled.span`
  font-weight: 400;
  font-size: 12px;
  transform: translateX(4px);
  display: inline-block;
`;

const Container = styled.div`
  cursor: pointer;
`;

type Props = {
  isChecked: boolean,
  label?: string,
  onToggle: boolean => void
}
class Checkbox extends React.Component<Props> {
  render() {
    const {isChecked, label, onToggle} = this.props;
    return <Container onClick={e => onToggle(!isChecked)}>
      <input type="checkbox"
             checked={isChecked} />
      <Label>{label}</Label>
    </Container>
  }
}

export default Checkbox;