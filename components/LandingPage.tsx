import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="relative h-screen w-screen bg-brand-primary text-brand-text overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-brand-primary bg-opacity-70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-brand-gold" />
            <h1 className="text-xl md:text-2xl font-bold text-brand-text tracking-wider">
              Ain Global <span className="text-brand-gold">Pro AI</span>
            </h1>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-brand-text tracking-tight mb-4 animate-fade-in-down">
            The Future of Real Estate Intelligence.
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-brand-light mb-8 animate-fade-in-up">
            Leverage the power of AI to elevate your property marketing, gain market insights, and manage client relationships seamlessly.
          </p>
          <button
            onClick={onLogin}
            className="bg-brand-gold text-brand-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Login to Your Workspace
          </button>
        </main>
        
        {/* Footer */}
        <footer className="p-4 text-center text-brand-light text-sm">
            <p>&copy; {new Date().getFullYear()} Ain Global. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
