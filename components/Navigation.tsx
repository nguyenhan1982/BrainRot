
import React from 'react';

type View = 'definitions' | 'quiz' | 'tracker';

interface NavigationProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'definitions', name: 'Định Nghĩa', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg> },
    { id: 'quiz', name: 'Trắc Nghiệm', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg> },
    { id: 'tracker', name: 'Theo Dõi', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-12a2.25 2.25 0 0 1-2.25-2.25V3M3.75 21v-6.167c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125V21M3.75 21h16.5M12 6.75v.008v.008v.008v.008v.008" /></svg> },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 rounded-lg shadow p-2">
      <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {navItems.map((item) => (
          <li key={item.id} className="flex-1">
            <button
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center justify-center p-3 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 ${
                currentView === item.id
                  ? 'bg-sky-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
