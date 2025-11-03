import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop';

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 text-center p-8 max-w-3xl flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold">
          Welcome to Lockwood & Carter
        </h1>
        <p className="text-xl text-brand-gold mt-2 mb-4 font-semibold">
          powered by Lucra
        </p>
        <p className="text-lg md:text-xl text-brand-light mb-8">
          The all-in-one AI-powered operating system for elite real estate agencies. Streamline content creation, gain market intelligence, and manage clients—all in one place.
        </p>
        <button
          onClick={onLogin}
          className="bg-brand-gold text-brand-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-colors shadow-lg"
        >
          Enter the Dashboard
        </button>
      </div>
      <footer className="absolute bottom-4 text-sm text-brand-light/70 z-10">
          <p>© 2025 Lucra. Powering elite real estate agencies.</p>
      </footer>
    </div>
  );
};

export default LandingPage;