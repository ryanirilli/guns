import styled from "styled-components";

export const H1 = styled.h1`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "gastromond", sans-serif;
  margin: 0;
`;
export const H2 = styled.h2`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 800;
  margin: 0;
  > span {
    font-weight: 100;
    display: block;
    font-size: 80%;
  }
`;

export const P = styled.p`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  font-weight: 100;
  font-size: 14px;
  line-height: 1.4;
  margin-top: 4px;
  font-family: monospace;
`;

export const A = styled.a``;
