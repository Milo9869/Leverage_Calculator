import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon, AlertTriangle } from "lucide-react";

const LeverageCalculator = () => {
  const [capital, setCapital] = useState('10000');
  const [isMaxLossPercentage, setIsMaxLossPercentage] = useState(true);
  const [maxLoss, setMaxLoss] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [tradingFees, setTradingFees] = useState('0.1');
  const [leverage, setLeverage] = useState(null);
  const [riskLevel, setRiskLevel] = useState('');
  const [positionSize, setPositionSize] = useState(null);

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
      
      const posSize = parseFloat(capital) * result;
      setPositionSize(posSize);

      if (result <= 2) setRiskLevel('faible');
      else if (result <= 5) setRiskLevel('modéré');
      else if (result <= 10) setRiskLevel('élevé');
      else setRiskLevel('très élevé');
    }
  };

  useEffect(() => {
    calculateLeverage();
  }, [capital, maxLoss, stopLoss, tradingFees, isMaxLossPercentage]);

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numValue);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'faible': return 'bg-green-100 text-green-800';
      case 'modéré': return 'bg-yellow-100 text-yellow-800';
      case 'élevé': return 'bg-orange-100 text-orange-800';
      case 'très élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            Calculateur de Levier
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Capital Total
              <InfoIcon className="h-4 w-4 text-gray-400" data-tip="Entrez votre capital total disponible" />
            </Label>
            <Input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="text-xl font-medium"
              placeholder="10000"
            />
            <p className="text-sm text-gray-500">{formatCurrency(capital)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Perte Maximale
                <InfoIcon className="h-4 w-4 text-gray-400" data-tip="Définissez la perte maximale en montant ou pourcentage" />
              </Label>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                <Label className={`text-sm px-3 py-1 rounded-full transition-colors ${!isMaxLossPercentage ? 'option-selected' : ''}`}>
                  Montant
                </Label>
                <Switch
                  checked={isMaxLossPercentage}
                  onCheckedChange={setIsMaxLossPercentage}
                />
                <Label className={`text-sm px-3 py-1 rounded-full transition-colors ${isMaxLossPercentage ? 'option-selected' : ''}`}>
                  Pourcentage
                </Label>
              </div>
            </div>
            <Input
              type="number"
              value={maxLoss}
              onChange={(e) => setMaxLoss(e.target.value)}
              className="text-xl font-medium"
              placeholder={isMaxLossPercentage ? "2" : "200"}
            />
            {!isMaxLossPercentage && maxLoss && (
              <p className="text-sm text-gray-500">
                {`${((parseFloat(maxLoss) / parseFloat(capital)) * 100).toFixed(2)}%`}
              </p>
            )}
            {isMaxLossPercentage && maxLoss && (
              <p className="text-sm text-gray-500">
                {formatCurrency((parseFloat(maxLoss) / 100) * parseFloat(capital))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Stop Loss (%)
              <InfoIcon className="h-4 w-4 text-gray-400" data-tip="Indiquez votre stop loss en pourcentage" />
            </Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="text-xl font-medium"
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Frais de Trading (%)
              <InfoIcon className="h-4 w-4 text-gray-400" data-tip="Définissez les frais de trading" />
            </Label>
            <Input
              type="number"
              value={tradingFees}
              onChange={(e) => setTradingFees(e.target.value)}
              className="text-xl font-medium"
              placeholder="0.1"
            />
          </div>
        </CardContent>
      </Card>
      <ReactTooltip place="top" type="dark" effect="solid" />
    </div>
  );
};

export default LeverageCalculator;
