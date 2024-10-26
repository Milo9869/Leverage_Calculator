// src/App.jsx
import React, { useState } from 'react';
import CryptoTracker from './components/CryptoTracker';
import CryptoAnalysis from './components/CryptoAnalysis';
import LeverageCalculator from './components/LeverageCalculator';

function App() {
  // Ceci est nécessaire pour gérer la sélection
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  // Cette fonction doit être définie
  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {selectedCrypto ? (
          <CryptoAnalysis 
            cryptoId={selectedCrypto.id}
            symbol={selectedCrypto.symbol}
            name={selectedCrypto.name}
            onBack={() => setSelectedCrypto(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Afficher le composant CryptoTracker */}
            <div>
              <CryptoTracker onSelectCrypto={handleCryptoSelect} />
            </div>
            {/* Afficher le composant LeverageCalculator */}
            <div>
              <LeverageCalculator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;