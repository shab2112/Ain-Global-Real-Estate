import React from 'react';

export const TokenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 10.5c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21c4.97 0 9-4.03 9-9h-9v9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12V3m0 9l-3.375-6.04m6.75 6.04L12 3"
    />
  </svg>
);
