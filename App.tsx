
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Definitions from './components/Definitions';
import Quiz from './components/Quiz';
import Tracker from './components/Tracker';

type View = 'definitions' | 'quiz' | 'tracker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('definitions');

  const renderView = () => {
    switch (currentView) {
      case 'definitions':
        return <Definitions />;
      case 'quiz':
        return <Quiz />;
      case 'tracker':
        return <Tracker />;
      default:
        return <Definitions />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        <div className="mt-8">
          {renderView()}
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-slate-500">
        <p>© 2024 Brain Rot. Được trang bị bởi AI.</p>
      </footer>
    </div>
  );
};

export default App;