import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useIndicators } from '../context/IndicatorsContext';
import RustIndicators from './RustIndicators';
import IndicatorSettings from './IndicatorSettings';
import FibonacciLevels from './FibonacciLevels';
import ChartComponent from './ChartComponent';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CryptoAnalysis = ({ cryptoId, symbol, name, onBack }) => {
  const { settings } = useIndicators();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [timeframe, setTimeframe] = useState('30'); // Nouveau state pour le timeframe

  useEffect(() => {
    loadPriceData();
  }, [cryptoId, timeframe]); // Recharger quand le timeframe change

  const loadPriceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=eur&days=${timeframe}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const data = await response.json();
      setPriceData(data);
    } catch (error) {
      setError(`Erreur de chargement des données: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  };

  // Fonction pour changer le timeframe
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton retour */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack}
          variant="ghost"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à la liste
        </Button>
        <h1 className="text-2xl font-bold">{name} ({symbol.toUpperCase()})</h1>
      </div>

      {/* Paramètres des indicateurs */}
      <IndicatorSettings />

      {/* Sélecteur de timeframe */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Button
            variant={timeframe === '1' ? 'default' : 'outline'}
            onClick={() => handleTimeframeChange('1')}
          >
            24H
          </Button>
          <Button
            variant={timeframe === '7' ? 'default' : 'outline'}
            onClick={() => handleTimeframeChange('7')}
          >
            7J
          </Button>
          <Button
            variant={timeframe === '30' ? 'default' : 'outline'}
            onClick={() => handleTimeframeChange('30')}
          >
            30J
          </Button>
          <Button
            variant={timeframe === '90' ? 'default' : 'outline'}
            onClick={() => handleTimeframeChange('90')}
          >
            90J
          </Button>
          <Button
            variant={timeframe === '365' ? 'default' : 'outline'}
            onClick={() => handleTimeframeChange('365')}
          >
            1A
          </Button>
        </div>
      </Card>

      {/* Graphique */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p>Chargement des données...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        priceData && (
          <ChartComponent 
            priceData={priceData}
            symbol={symbol}
            onTimeframeChange={handleTimeframeChange}
          />
        )
      )}

      {/* Niveaux de Fibonacci */}
      {priceData && (
        <FibonacciLevels 
          priceData={priceData.prices} 
          windowSize={settings.fibonacci.windowSize}
        />
      )}

      {/* Indicateurs Techniques calculés avec Rust */}
      {priceData && <RustIndicators priceData={priceData} />}

      {/* Statistiques */}
      {priceData && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de la période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Plus Haut</h3>
                <p className="text-lg font-semibold">
                  {formatCurrency(Math.max(...priceData.prices.map(p => p[1])))}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Plus Bas</h3>
                <p className="text-lg font-semibold">
                  {formatCurrency(Math.min(...priceData.prices.map(p => p[1])))}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">Volume Moyen</h3>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    priceData.total_volumes.reduce((acc, curr) => acc + curr[1], 0) / 
                    priceData.total_volumes.length
                  )}
                </p>
              </div>
            </div>

            {/* Variations de prix */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeframe !== '1' && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Variation 24h</h3>
                  <p className={`text-lg font-semibold ${
                    getPriceChange(priceData.prices, 1) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatNumber(getPriceChange(priceData.prices, 1))}%
                  </p>
                </div>
              )}
              {timeframe !== '7' && timeframe !== '1' && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Variation 7j</h3>
                  <p className={`text-lg font-semibold ${
                    getPriceChange(priceData.prices, 7) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatNumber(getPriceChange(priceData.prices, 7))}%
                  </p>
                </div>
              )}
              {timeframe !== '30' && timeframe !== '7' && timeframe !== '1' && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Variation 30j</h3>
                  <p className={`text-lg font-semibold ${
                    getPriceChange(priceData.prices, 30) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatNumber(getPriceChange(priceData.prices, 30))}%
                  </p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">
                  Variation {timeframe}j
                </h3>
                <p className={`text-lg font-semibold ${
                  getPriceChange(priceData.prices, parseInt(timeframe)) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatNumber(getPriceChange(priceData.prices, parseInt(timeframe)))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avertissement sur les données */}
      <div className="text-sm text-gray-500 text-center">
        Données mises à jour en temps réel • Source: CoinGecko
      </div>
    </div>
  );
};

// Fonction utilitaire pour calculer les variations de prix
const getPriceChange = (prices, days) => {
  if (!prices || prices.length < days) return 0;
  
  const currentPrice = prices[prices.length - 1][1];
  const oldPrice = prices[Math.max(0, prices.length - (days * 24))][1];
  
  return ((currentPrice - oldPrice) / oldPrice) * 100;
};

export default CryptoAnalysis;