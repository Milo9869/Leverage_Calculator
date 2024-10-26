import React from 'react';
import LeverageCalculator from './components/LeverageCalculator';
import CryptoTracker from './components/CryptoTracker';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <CryptoTracker />
        <LeverageCalculator />
      </div>
    </div>
  );
}

export default App;