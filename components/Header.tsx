
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary p-4 shadow-md flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-brand-gold" />
        <h1 className="text-xl md:text-2xl font-bold text-brand-text tracking-wider">
          Ain Global <span className="text-brand-gold">Pro AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
