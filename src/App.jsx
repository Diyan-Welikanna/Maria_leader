import React, { useState } from 'react';
import './App.css';
import TankSoundingForm from './components/TankSoundingForm';
import TankResults from './components/TankResults';
import History from './components/History';
import Analytics from './components/Analytics';
import SoundingTables from './components/SoundingTables';
import { saveRecord } from './utils/storageManager';
import { useTheme } from './context/ThemeContext';

function App() {
  const [results, setResults] = useState(null);
  const [currentView, setCurrentView] = useState('calculator');
  const [lastSaved, setLastSaved] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const handleCalculate = (tankResults, date) => {
    setResults(tankResults);
    setSelectedDate(date);
    setLastSaved(null);
  };

  const handleReset = () => {
    setResults(null);
    setSelectedDate(null);
    setLastSaved(null);
  };

  const handleSave = async () => {
    if (results && Object.keys(results).length > 0) {
      const record = await saveRecord(results, results, selectedDate);
      setLastSaved(record);
      alert('Sounding record saved successfully!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
              </svg>
              <div className="header-text">
                <h1>Maria Leader Fresh Water Sounding</h1>
                <p>Fresh water tank sounding calculator</p>
              </div>
            </div>
          </div>
          
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" fill="currentColor"/>
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>

        <div className="nav-tabs">
          <button 
            className={`tab ${currentView === 'calculator' ? 'active' : ''}`}
            onClick={() => setCurrentView('calculator')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="7" x2="9" y2="17" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="7" x2="15" y2="17" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Calculator
          </button>
          <button 
            className={`tab ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            History
          </button>
          <button 
            className={`tab ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analytics
          </button>
          <button 
            className={`tab ${currentView === 'tables' ? 'active' : ''}`}
            onClick={() => setCurrentView('tables')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tables
          </button>
        </div>
      </header>
      
      <main className="App-main">
        <div className="container">
          {currentView === 'calculator' ? (
            <>
              <TankSoundingForm onCalculate={handleCalculate} onReset={handleReset} />
              {results && Object.keys(results).length > 0 && (
                <>
                  <TankResults results={results} />
                  <div className="save-section">
                    <button onClick={handleSave} className="btn-save">
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Save Record
                    </button>
                    {lastSaved && (
                      <span className="save-confirmation">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Saved at {lastSaved.time} on {lastSaved.date}
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          ) : currentView === 'history' ? (
            <History />
          ) : currentView === 'analytics' ? (
            <Analytics />
          ) : (
            <SoundingTables />
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Created by Diyan Welikanna</p>
      </footer>
    </div>
  );
}

export default App;
