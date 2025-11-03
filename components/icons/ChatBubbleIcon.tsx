import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a56.029 56.029 0 01-4.908 0l-3.722-.537C5.347 17.1 4.5 16.136 4.5 15v-4.286c0-.97.616-1.813 1.5-2.097v6.096c0 .662.537 1.2 1.2 1.2h10.2c.663 0 1.2-.538 1.2-1.2v-6.096z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 7.5l-3.75 3-3.75-3"
    />
  </svg>
);
