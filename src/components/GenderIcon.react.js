
import * as React from "react";
import { activeColor, inactiveColor } from "../styles/Colors";

export default ({
  gender,
  isActive,
  onClick
}) =>
  gender === "male" ? (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 111.11 111.11"
    >
      <title>male_1</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="male">
          <g id="male-2" data-name="male">
            <g id="male-3" data-name="male">
              <path
                id="circle"
                d="M111.11,55.56A55.56,55.56,0,1,1,55.55,0,55.55,55.55,0,0,1,111.11,55.56Z"
                style={{ fill: isActive ? activeColor : inactiveColor }}
              />
              <g id="figure">
                <path
                  d="M72.54,61.09c-.4-2.18-3.87-21.37-4.13-22.55-.53-2.38-4.08-5.57-7-5.57H58.91a5.57,5.57,0,0,1-6.78,0H49.69c-2.91,0-6.46,3.19-7,5.57-.26,1.18-3.73,20.37-4.13,22.55a2.69,2.69,0,0,0,5.3,1c.93-5.13,2.15-11.87,3-16.61h.62V93.15h6.7v-28h2.47v28h6.73V45.44h.81c.87,4.74,2.09,11.48,3,16.61a2.69,2.69,0,0,0,5.3-1Z"
                  style={{ fill: "#fff" }}
                />
                <path
                  d="M55.52,31.21a6.63,6.63,0,1,0-6.63-6.63A6.63,6.63,0,0,0,55.52,31.21Z"
                  style={{ fill: "#fff" }}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  ) : (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 111.11 111.11"
    >
      <title>female</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="female">
          <g id="female-2" data-name="female">
            <g id="female-3" data-name="female">
              <path
                d="M111.11,55.56A55.56,55.56,0,1,1,55.55,0,55.55,55.55,0,0,1,111.11,55.56Z"
                style={{ fill: isActive ? activeColor : inactiveColor }}
              />
              <g>
                <path
                  d="M73.27,60.92h0L67.72,38.47c-.55-2.17-3.89-5.5-7-5.5H59.29a5.57,5.57,0,0,1-6.78,0H50.36c-3.08,0-6.42,3.33-7,5.5L37.84,60.92a2.69,2.69,0,1,0,5.23,1.29h0l4.57-18.5h.62v4.62l-4.95,21h5.06V93.15h6.7V69.38H56.2V93.15h6.73V69.38h4.88l-5-21.08V43.71h.62L68,62.21a2.69,2.69,0,1,0,5.23-1.29Z"
                  style={{ fill: "#fff" }}
                />
                <path
                  d="M55.81,31.21a6.63,6.63,0,1,0-6.63-6.63A6.63,6.63,0,0,0,55.81,31.21Z"
                  style={{ fill: "#fff" }}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
