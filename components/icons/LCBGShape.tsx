import React from 'react';

export const LCBGShape: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <path
      d="M -150 550 L 550 -150"
      stroke="black"
      strokeWidth="250"
      strokeLinecap="round"
    />
    <path
      d="M 50 650 L 750 -50"
      stroke="black"
      strokeWidth="250"
      strokeLinecap="round"
    />
  </svg>
);