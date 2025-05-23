import React from 'react';
import {Svg, Path} from 'react-native-svg';

const CameraIcon = ({
  width = 24,
  height = 24,
  fill = 'currentColor',
  style,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={[style, {color: fill}]}>
      <Path
        d="M12 9C10.374 9 9 10.374 9 12C9 13.626 10.374 15 12 15C13.626 15 15 13.626 15 12C15 10.374 13.626 9 12 9Z"
        fill="currentColor"
      />
      <Path
        d="M20 5H17.414L14.707 2.293C14.5195 2.10545 14.2652 2.00006 14 2H10C9.7348 2.00006 9.48049 2.10545 9.293 2.293L6.586 5H4C2.897 5 2 5.897 2 7V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V7C22 5.897 21.103 5 20 5ZM12 17C9.29 17 7 14.71 7 12C7 9.29 9.29 7 12 7C14.71 7 17 9.29 17 12C17 14.71 14.71 17 12 17Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default CameraIcon;
