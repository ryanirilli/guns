import styled from "styled-components";

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export const AbsoluteFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const FlexFill = styled.div`
  display: flex;
  height: 100%;
  > div {
    flex: 1;
  }
`;
