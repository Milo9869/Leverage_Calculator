import React, { useState } from 'react';
import LeverageCalculator from './components/LeverageCalculator';
import CryptoTracker from './components/CryptoTracker';
import CryptoAnalysis from './components/CryptoAnalysis';
import TabNavigation from './components/TabNavigation';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleBackToList = () => {
    setSelectedCrypto(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'calculator' ? (
          <div className="max-w-md mx-auto">
            <LeverageCalculator />
          </div>
        ) : (
          selectedCrypto ? (
            <CryptoAnalysis 
              cryptoId={selectedCrypto.id}
              symbol={selectedCrypto.symbol}
              name={selectedCrypto.name}
              onBack={handleBackToList}
            />
          ) : (
            <CryptoTracker onSelectCrypto={handleCryptoSelect} />
          )
        )}
      </div>
    </div>
  );
}

export default App;