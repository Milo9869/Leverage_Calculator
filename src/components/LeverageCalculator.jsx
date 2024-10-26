import React, { useState, useEffect } from 'react';
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const LeverageCalculator = () => {
  const [capital, setCapital] = useState('10000');
  const [isMaxLossPercentage, setIsMaxLossPercentage] = useState(true);
  const [maxLoss, setMaxLoss] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [tradingFees, setTradingFees] = useState('0.1');
  const [leverage, setLeverage] = useState(null);

  const calculateLeverage = () => {
    let maxLossPercent = parseFloat(maxLoss);
    if (!isMaxLossPercentage) {
      maxLossPercent = (parseFloat(maxLoss) / parseFloat(capital)) * 100;
    }
    
    const stopLossPercent = parseFloat(stopLoss);
    const feesPercent = parseFloat(tradingFees);

    if (maxLossPercent && stopLossPercent && feesPercent !== undefined) {
      const result = maxLossPercent / (stopLossPercent + feesPercent);
      setLeverage(result.toFixed(2));
    }
  };

  useEffect(() => {
    calculateLeverage();
  }, [capital, maxLoss, stopLoss, tradingFees, isMaxLossPercentage]);

  const handleMaxLossChange = (value) => {
    setMaxLoss(value);
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numValue);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">Calculateur de Levier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Capital Total */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Capital Total</Label>
          <Input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="text-xl font-medium"
            placeholder="10000"
          />
          <p className="text-sm text-gray-500">{formatCurrency(capital)}</p>
        </div>

        {/* Perte Maximale */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-gray-700">Perte Maximale</Label>
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-gray-500">Montant</Label>
              <Switch
                checked={isMaxLossPercentage}
                onCheckedChange={setIsMaxLossPercentage}
              />
              <Label className="text-sm text-gray-500">Pourcentage</Label>
            </div>
          </div>
          <Input
            type="number"
            value={maxLoss}
            onChange={(e) => handleMaxLossChange(e.target.value)}
            className="text-xl font-medium"
            placeholder={isMaxLossPercentage ? "2" : "200"}
          />
          {!isMaxLossPercentage && (
            <p className="text-sm text-gray-500">
              {maxLoss ? `${((parseFloat(maxLoss) / parseFloat(capital)) * 100).toFixed(2)}%` : ''}
            </p>
          )}
          {isMaxLossPercentage && (
            <p className="text-sm text-gray-500">
              {maxLoss ? formatCurrency((parseFloat(maxLoss) / 100) * parseFloat(capital)) : ''}
            </p>
          )}
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Stop Loss (%)</Label>
          <Input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="text-xl font-medium"
            placeholder="1"
          />
        </div>

        {/* Frais de Trading */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Frais de Trading (%)</Label>
          <Input
            type="number"
            value={tradingFees}
            onChange={(e) => setTradingFees(e.target.value)}
            className="text-xl font-medium"
            placeholder="0.1"
          />
        </div>

        {/* Résultat */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Effet de Levier</h3>
              <p className="text-4xl font-bold text-blue-600">
                {leverage !== null ? `${leverage}x` : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default LeverageCalculator;