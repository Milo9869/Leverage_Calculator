import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

const FibonacciLevels = ({ priceData, onLevelsCalculated }) => {
  const [levels, setLevels] = useState(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const [highPoint, setHighPoint] = useState(null);
  const [lowPoint, setLowPoint] = useState(null);

  useEffect(() => {
    if (autoDetect && priceData?.length > 0) {
      calculateAutomaticLevels();
    }
  }, [priceData, autoDetect]);

  const calculateAutomaticLevels = async () => {
    try {
      const prices = priceData.map(point => point[1]);
      const high = Math.max(...prices);
      const low = Math.min(...prices);
      
      // Utiliser le module Rust pour les calculs
      const rustModule = await import('../rust-indicators/pkg');
      await rustModule.default();
      
      const analysis = new rustModule.TechnicalAnalysis(prices);
      const fibData = analysis.calculate_fibonacci(20);
      
      setLevels(fibData.levels);
      setHighPoint(fibData.swing_high);
      setLowPoint(fibData.swing_low);
      
      if (onLevelsCalculated) {
        onLevelsCalculated(fibData);
      }
    } catch (error) {
      console.error('Erreur lors du calcul des niveaux Fibonacci:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Niveaux de Fibonacci</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Détection automatique</span>
            <Switch
              checked={autoDetect}
              onCheckedChange={setAutoDetect}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!autoDetect && (
          <div className="mb-4">
            <Button
              onClick={calculateAutomaticLevels}
              className="w-full"
            >
              Calculer les niveaux
            </Button>
          </div>
        )}
        
        {levels && (
          <div className="space-y-2">
            {levels.map((level, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  level.strength === "Fort" 
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : level.strength === "Moyen"
                    ? "bg-gray-50 border-l-4 border-gray-500"
                    : "bg-gray-50"
                }`}
              >
                <div>
                  <span className="font-medium">
                    {(level.ratio * 100).toFixed(1)}%
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {level.type_level}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{formatPrice(level.price)}</span>
                  {level.strength === "Fort" && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      Fort
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {(highPoint || lowPoint) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Point Haut</span>
                <p className="font-medium">{formatPrice(highPoint)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Point Bas</span>
                <p className="font-medium">{formatPrice(lowPoint)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FibonacciLevels;