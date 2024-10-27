import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IndicatorsProvider } from './context/IndicatorsContext';
import theme from './components/ui/theme';
import CryptoTracker from './components/CryptoTracker';
import CryptoAnalysis from './components/CryptoAnalysis';
import LeverageCalculator from './components/LeverageCalculator';
import TabNavigation from './components/TabNavigation';
import './styles/globals.css';

function App() {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  return (
    <ThemeProvider theme={theme}>
      <IndicatorsProvider>
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
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
                  <LeverageCalculator />
                ) : (
                  <CryptoTracker onSelectCrypto={handleCryptoSelect} />
                )}
              </div>
            )}
          </div>
        </div>
      </IndicatorsProvider>
    </ThemeProvider>
  );
}

export default App;