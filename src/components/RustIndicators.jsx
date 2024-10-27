import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useIndicators } from '../context/IndicatorsContext';
import { Alert, AlertTitle } from './ui/alert';

const RustIndicators = ({ priceData }) => {
  const { settings } = useIndicators();
  const [indicators, setIndicators] = useState({
    rsi: null,
    macd: null,
    bollinger: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    calculateIndicators();
  }, [priceData, settings]); // Recalculer quand les paramètres changent

  const calculateIndicators = async () => {
    if (!priceData?.prices?.length) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const rustModule = await import('../rust-indicators/pkg');
      await rustModule.default();
      
      // Convertir les données de prix en format utilisable
      const prices = priceData.prices.map(p => p[1]);
      
      const analysis = new rustModule.TechnicalAnalysis(prices);
      
      // Calculer les indicateurs avec les paramètres du contexte
      const rsiData = analysis.calculate_rsi(settings.rsi.period);
      const macdData = analysis.calculate_macd(
        settings.macd.fastPeriod,
        settings.macd.slowPeriod,
        settings.macd.signalPeriod
      );
      const bollingerData = analysis.calculate_bollinger(
        settings.bollinger.period,
        settings.bollinger.deviations
      );
      
      setIndicators({
        rsi: rsiData[rsiData.length - 1],
        macd: macdData,
        bollinger: bollingerData
      });
    } catch (error) {
      console.error('Erreur lors du calcul des indicateurs:', error);
      setError("Une erreur est survenue lors du calcul des indicateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const getRsiSignal = (value) => {
    if (value >= settings.rsi.overbought) return 'Survente';
    if (value <= settings.rsi.oversold) return 'Surachat';
    return 'Neutre';
  };

  const getMacdSignal = (macdData) => {
    const lastIndex = macdData.histogram.length - 1;
    const currentHist = macdData.histogram[lastIndex];
    const prevHist = macdData.histogram[lastIndex - 1];

    if (currentHist > 0 && prevHist <= 0) return 'Signal d\'achat';
    if (currentHist < 0 && prevHist >= 0) return 'Signal de vente';
    return 'Pas de signal clair';
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicateurs Techniques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RSI Card */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">RSI</h3>
            {isLoading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold mb-1">
                  {indicators.rsi?.toFixed(2)}
                </p>
                <p className={`text-sm ${
                  getRsiSignal(indicators.rsi) === 'Survente' ? 'text-red-500' :
                  getRsiSignal(indicators.rsi) === 'Surachat' ? 'text-green-500' :
                  'text-gray-500'
                }`}>
                  {getRsiSignal(indicators.rsi)}
                </p>
              </div>
            )}
          </div>

          {/* MACD Card */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">MACD</h3>
            {isLoading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold mb-1">
                  {indicators.macd?.histogram[indicators.macd.histogram.length - 1]?.toFixed(4)}
                </p>
                <p className={`text-sm ${
                  getMacdSignal(indicators.macd).includes('achat') ? 'text-green-500' :
                  getMacdSignal(indicators.macd).includes('vente') ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {getMacdSignal(indicators.macd)}
                </p>
              </div>
            )}
          </div>

          {/* Bollinger Bands Card */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Bandes de Bollinger</h3>
            {isLoading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            ) : (
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Supérieure: {indicators.bollinger?.upper_band[indicators.bollinger.upper_band.length - 1]?.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium">
                    Moyenne: {indicators.bollinger?.middle_band[indicators.bollinger.middle_band.length - 1]?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Inférieure: {indicators.bollinger?.lower_band[indicators.bollinger.lower_band.length - 1]?.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Volatilité: {(indicators.bollinger?.bandwidth[indicators.bollinger.bandwidth.length - 1] || 0).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RustIndicators;