import React, { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Importer ReactTooltip
import CryptoTracker from './components/CryptoTracker';
import CryptoAnalysis from './components/CryptoAnalysis';
import LeverageCalculator from './components/LeverageCalculator';
import TabNavigation from './components/TabNavigation';

function App() {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {selectedCrypto ? (
          <CryptoAnalysis 
            cryptoId={selectedCrypto.id}
            symbol={selectedCrypto.symbol}
            name={selectedCrypto.name}
            onBack={() => setSelectedCrypto(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeTab === 'calculator' ? (
              <div>
                <LeverageCalculator />
              </div>
            ) : (
              <div>
                <CryptoTracker onSelectCrypto={handleCryptoSelect} />
              </div>
            )}
          </div>
        )}

        {/* Ajoute ReactTooltip ici pour le rendre disponible globalement */}
        <ReactTooltip place="top" type="dark" effect="solid" />
      </div>
    </div>
  );
}

export default App;
