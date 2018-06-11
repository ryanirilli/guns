import styled from "styled-components";
import { BASE_SPACING_UNIT } from "./Foundation";

export const PadMain = styled.div`
  position: relative;
  padding: ${props => {
    const { base, top, right, bottom, left } = props;
    const bs = base != null ? base : BASE_SPACING_UNIT * 4;
    const t = top != null ? top : bs;
    const r = right != null ? right : bs;
    const b = bottom != null ? bottom : bs;
    const l = left != null ? left : bs;
    return `${t}px ${r}px ${b}px ${l}px`;
  }};
`;
