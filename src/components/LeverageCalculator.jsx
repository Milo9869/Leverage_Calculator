// LeverageCalculator.jsx

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';

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
      const posSize = (parseFloat(capital) * result) / 1;
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
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(numValue);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'faible':
        return 'success';
      case 'modéré':
        return 'warning';
      case 'élevé':
        return 'error';
      case 'très élevé':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card variant="outlined" sx={{ maxWidth: 800, margin: '0 auto' }}>
        <CardHeader
          title={
            <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalculateIcon sx={{ mr: 1 }} />
              Calculateur d'Effet de Levier
            </Typography>
          }
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {/* Capital Total */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Capital Total"
                type="number"
                fullWidth
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Le capital total dont vous disposez pour le trading.">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
              <Typography variant="body2" color="textSecondary">
                {formatCurrency(capital)}
              </Typography>
            </Grid>

            {/* Perte Maximale */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMaxLossPercentage}
                    onChange={(e) => setIsMaxLossPercentage(e.target.checked)}
                    color="primary"
                  />
                }
                label="Perte Maximale en Pourcentage"
              />
              <TextField
                label="Perte Maximale"
                type="number"
                fullWidth
                value={maxLoss}
                onChange={(e) => setMaxLoss(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="La perte maximale que vous êtes prêt à accepter sur une position.">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
              {maxLoss && (
                <Typography variant="body2" color="textSecondary">
                  {!isMaxLossPercentage
                    ? `${((parseFloat(maxLoss) / parseFloat(capital)) * 100).toFixed(2)}%`
                    : formatCurrency((parseFloat(maxLoss) / 100) * parseFloat(capital))}
                </Typography>
              )}
            </Grid>

            {/* Stop Loss */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stop Loss (%)"
                type="number"
                fullWidth
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Le pourcentage de stop loss que vous souhaitez définir.">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Grid>

            {/* Frais de Trading */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Frais de Trading (%)"
                type="number"
                fullWidth
                value={tradingFees}
                onChange={(e) => setTradingFees(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Les frais de trading appliqués par votre plateforme.">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Résultats */}
          <Grid container spacing={2}>
            {/* Effet de Levier */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  textAlign: 'center',
                  padding: '20px',
                }}
              >
                <Typography variant="h6">Effet de Levier</Typography>
                <Typography variant="h3">
                  {leverage !== null ? `${leverage}x` : '-'}
                </Typography>
              </Card>
            </Grid>

            {/* Taille de Position */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  backgroundColor: 'secondary.light',
                  color: 'secondary.contrastText',
                  textAlign: 'center',
                  padding: '20px',
                }}
              >
                <Typography variant="h6">Taille de Position</Typography>
                <Typography variant="h3">
                  {positionSize ? formatCurrency(positionSize) : '-'}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Niveau de Risque */}
          {riskLevel && (
            <Alert severity={getRiskColor()} icon={<WarningIcon />}>
              <AlertTitle>Niveau de Risque: {riskLevel.toUpperCase()}</AlertTitle>
              {riskLevel === 'très élevé' &&
                'Attention: Ce niveau de levier est extrêmement risqué.'}
              {riskLevel === 'élevé' &&
                'Ce niveau de levier présente des risques importants.'}
              {riskLevel === 'modéré' &&
                'Niveau de risque acceptable pour les traders expérimentés.'}
              {riskLevel === 'faible' &&
                'Niveau de risque conservateur, adapté aux débutants.'}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Aide et Informations */}
      <Alert severity="info" sx={{ maxWidth: 800, margin: '20px auto' }}>
        <AlertTitle>Comment utiliser le calculateur :</AlertTitle>
        <ul style={{ paddingLeft: '16px', margin: 0 }}>
          <li>Entrez votre capital total disponible</li>
          <li>
            Définissez votre perte maximale acceptable (en montant ou en pourcentage)
          </li>
          <li>Configurez votre stop loss en pourcentage</li>
          <li>Ajustez les frais de trading selon votre plateforme</li>
        </ul>
      </Alert>
    </div>
  );
};

export default LeverageCalculator;
