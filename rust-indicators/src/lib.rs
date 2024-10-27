use wasm_bindgen::prelude::*;
use models::types::IndicatorSettings;

mod indicators;
mod models;
mod utils;

#[wasm_bindgen]
pub struct TechnicalAnalysis {
    data: Vec<f64>,
}

#[wasm_bindgen]
impl TechnicalAnalysis {
    #[wasm_bindgen(constructor)]
    pub fn new(prices: Vec<f64>) -> TechnicalAnalysis {
        console_error_panic_hook::set_once();
        TechnicalAnalysis { data: prices }
    }

    // Méthode principale pour calculer tous les indicateurs
    pub fn calculate_all_indicators(&self, settings: JsValue) -> JsValue {
        let settings: IndicatorSettings = serde_wasm_bindgen::from_value(settings)
            .unwrap_or_default();

        let result = serde_json::json!({
            "rsi": self.calculate_rsi(settings.rsi_period),
            "macd": self.calculate_macd(
                settings.macd_fast,
                settings.macd_slow,
                settings.macd_signal
            ),
            "bollinger": self.calculate_bollinger_bands(
                settings.bollinger_period,
                settings.bollinger_deviations
            ),
            "fibonacci": self.calculate_fibonacci(settings.fibonacci_window),
        });

        serde_wasm_bindgen::to_value(&result).unwrap()
    }

    // Déléguer les calculs aux modules spécifiques
    pub fn calculate_rsi(&self, period: usize) -> Array {
        indicators::rsi::calculate_rsi(&self.data, period)
    }

    pub fn calculate_macd(&self, fast: usize, slow: usize, signal: usize) -> JsValue {
        indicators::macd::calculate_macd(&self.data, fast, slow, signal)
    }

    pub fn calculate_bollinger_bands(&self, period: usize, deviations: f64) -> JsValue {
        indicators::bollinger::calculate_bollinger(&self.data, period, deviations)
    }

    pub fn calculate_fibonacci(&self, window: usize) -> JsValue {
        indicators::fibonacci::calculate_fibonacci(&self.data, window)
    }
}