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
          // Ici, on passe la prop onSelectCrypto
          <CryptoTracker onSelectCrypto={handleCryptoSelect} />
        )}
      </div>
    </div>
  );
}

export default App;