
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentStudio from './components/ContentStudio';
import MarketIntelligence from './components/MarketIntelligence';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.MarketIntelligence);

  const renderContent = () => {
    switch (activeView) {
      case View.ContentStudio:
        return <ContentStudio />;
      case View.MarketIntelligence:
        return <MarketIntelligence />;
      // Add other views here as they are built
      default:
        return <ContentStudio />; // Default to Content Studio
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
