use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct IndicatorSettings {
    pub rsi_period: usize,
    pub macd_fast: usize,
    pub macd_slow: usize,
    pub macd_signal: usize,
    pub bollinger_period: usize,
    pub bollinger_deviations: f64,
    pub fibonacci_window: usize,
}

impl Default for IndicatorSettings {
    fn default() -> Self {
        Self {
            rsi_period: 14,
            macd_fast: 12,
            macd_slow: 26,
            macd_signal: 9,
            bollinger_period: 20,
            bollinger_deviations: 2.0,
            fibonacci_window: 20,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct MacdResult {
    pub macd_line: Vec<f64>,
    pub signal_line: Vec<f64>,
    pub histogram: Vec<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct BollingerBands {
    pub upper_band: Vec<f64>,
    pub middle_band: Vec<f64>,
    pub lower_band: Vec<f64>,
    pub bandwidth: Vec<f64>,
    pub percent_b: Vec<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct FibonacciLevel {
    pub ratio: f64,
    pub price: f64,
    pub type_level: String,
    pub strength: String,
}

#[derive(Serialize, Deserialize)]
pub struct FibonacciLevels {
    pub levels: Vec<FibonacciLevel>,
    pub trend: String,
    pub swing_high: f64,
    pub swing_low: f64,
}