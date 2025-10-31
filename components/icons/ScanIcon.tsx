import React from 'react';

export const ScanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M3 8.25V7.5a2.25 2.25 0 012.25-2.25h1.5M3 15.75V16.5a2.25 2.25 0 002.25 2.25h1.5M16.5 20.25h1.5a2.25 2.25 0 002.25-2.25V16.5M19.5 8.25V7.5a2.25 2.25 0 00-2.25-2.25h-1.5"
    />
  </svg>
);