// Exporte le module types
pub mod types;

// Re-export des types principaux pour faciliter leur utilisation
pub use types::{
    IndicatorSettings,
    MacdResult,
    BollingerBands,
    FibonacciLevel,
    FibonacciLevels,
};

// Structure pour les configurations par défaut
pub const DEFAULT_SETTINGS: IndicatorSettings = IndicatorSettings {
    rsi_period: 14,
    macd_fast: 12,
    macd_slow: 26,
    macd_signal: 9,
    bollinger_period: 20,
    bollinger_deviations: 2.0,
    fibonacci_window: 20,
};

// Constantes pour les ratios Fibonacci
pub const FIBONACCI_RATIOS: [f64; 9] = [
    0.0,    // 0%
    0.236,  // 23.6%
    0.382,  // 38.2%
    0.5,    // 50%
    0.618,  // 61.8%
    0.786,  // 78.6%
    1.0,    // 100%
    1.618,  // 161.8%
    2.618,  // 261.8%
];

// Constantes pour les seuils des indicateurs
pub mod thresholds {
    pub const RSI_OVERBOUGHT: f64 = 70.0;
    pub const RSI_OVERSOLD: f64 = 30.0;
    pub const BOLLINGER_HIGH_VOLATILITY: f64 = 30.0;
    pub const BOLLINGER_LOW_VOLATILITY: f64 = 10.0;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_settings() {
        assert_eq!(DEFAULT_SETTINGS.rsi_period, 14);
        assert_eq!(DEFAULT_SETTINGS.macd_fast, 12);
        assert_eq!(DEFAULT_SETTINGS.macd_slow, 26);
        assert_eq!(DEFAULT_SETTINGS.bollinger_deviations, 2.0);
    }

    #[test]
    fn test_fibonacci_ratios() {
        assert_eq!(FIBONACCI_RATIOS[0], 0.0);
        assert!((FIBONACCI_RATIOS[2] - 0.382).abs() < f64::EPSILON);
        assert!((FIBONACCI_RATIOS[4] - 0.618).abs() < f64::EPSILON);
    }
}