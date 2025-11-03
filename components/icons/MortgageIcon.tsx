import React from 'react';

export const MortgageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-1.06 1.06L12 4.061 3.31 12.75a.75.75 0 01-1.06-1.06l.001-.001z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12.75v6a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-6"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);
