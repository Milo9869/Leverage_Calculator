import React, { useState, useEffect } from 'react';
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
      
      // Calculer la taille de la position
      const posSize = parseFloat(capital) * result;
      setPositionSize(posSize);

      // Déterminer le niveau de risque
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculateur de Levier
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Capital Total */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Capital Total
              <InfoIcon className="h-4 w-4 text-gray-400" />
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

          {/* Perte Maximale */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Perte Maximale
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </Label>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                <Label className={`text-sm px-3 py-1 rounded-full transition-colors ${!isMaxLossPercentage ? 'bg-white shadow-sm' : ''}`}>
                  Montant
                </Label>
                <Switch
                  checked={isMaxLossPercentage}
                  onCheckedChange={setIsMaxLossPercentage}
                />
                <Label className={`text-sm px-3 py-1 rounded-full transition-colors ${isMaxLossPercentage ? 'bg-white shadow-sm' : ''}`}>
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

          {/* Stop Loss */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Stop Loss (%)
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </Label>
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
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Frais de Trading (%)
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </Label>
            <Input
              type="number"
              value={tradingFees}
              onChange={(e) => setTradingFees(e.target.value)}
              className="text-xl font-medium"
              placeholder="0.1"
            />
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {/* Effet de Levier */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Effet de Levier</h3>
                    <p className="text-4xl font-bold text-blue-600">
                      {leverage !== null ? `${leverage}x` : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Taille de Position</h3>
                    <p className="text-4xl font-bold text-blue-600">
                      {positionSize ? formatCurrency(positionSize) : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Niveau de Risque */}
            {riskLevel && (
              <div className={`rounded-lg p-4 ${getRiskColor()}`}>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <div>
                    <h4 className="font-semibold">Niveau de Risque: {riskLevel.toUpperCase()}</h4>
                    <p className="text-sm mt-1">
                      {riskLevel === 'très élevé' && "Attention: Ce niveau de levier est extrêmement risqué."}
                      {riskLevel === 'élevé' && "Ce niveau de levier présente des risques importants."}
                      {riskLevel === 'modéré' && "Niveau de risque acceptable pour les traders expérimentés."}
                      {riskLevel === 'faible' && "Niveau de risque conservateur, adapté aux débutants."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Aide et Informations */}
      <Alert className="max-w-2xl mx-auto">
        <AlertDescription>
          <h4 className="font-semibold mb-2">Comment utiliser le calculateur :</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Entrez votre capital total disponible</li>
            <li>Définissez votre perte maximale acceptable (en montant ou en pourcentage)</li>
            <li>Configurez votre stop loss en pourcentage</li>
            <li>Ajustez les frais de trading selon votre plateforme</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LeverageCalculator;