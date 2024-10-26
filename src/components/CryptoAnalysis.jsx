import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const CryptoAnalysis = ({ cryptoId, symbol, name, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    // Fonction pour créer le widget
    const createWidget = () => {
      if (window.TradingView && document.getElementById('tradingview_chart')) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol.toUpperCase()}EUR`,
          interval: 'D',
          timezone: 'Europe/Paris',
          theme: 'light',
          style: '1',
          locale: 'fr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          height: 500,
          save_image: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650'
        });
        setLoading(false);
      }
    };

    // Charger le script TradingView
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        createWidget();
      };
      document.head.appendChild(script);
    } else {
      createWidget();
    }

    // Récupération des données supplémentaires
    fetchCryptoData();

    // Nettoyage
    return () => {
      const oldScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (oldScript && oldScript.parentNode) {
        oldScript.parentNode.removeChild(oldScript);
      }
    };
  }, [symbol]);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=eur&days=30`
      );
      const data = await response.json();
      setPriceData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à la liste
        </button>
        <h1 className="text-2xl font-bold">{name} ({symbol.toUpperCase()})</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyse Technique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative" style={{ height: '500px' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <p>Chargement du graphique...</p>
                </div>
              </div>
            )}
            <div 
              id="tradingview_chart" 
              className="w-full h-full"
            />
          </div>
        </CardContent>
      </Card>

      {priceData && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des 30 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Plus Haut</h3>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(Math.max(...priceData.prices.map(p => p[1])))}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Plus Bas</h3>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(Math.min(...priceData.prices.map(p => p[1])))}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Volume Moyen</h3>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(priceData.total_volumes.reduce((acc, curr) => acc + curr[1], 0) / priceData.total_volumes.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CryptoAnalysis;