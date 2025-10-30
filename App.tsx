
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentStudio from './components/ContentStudio';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <ContentStudio />
        </main>
      </div>
    </div>
  );
};

export default App;
