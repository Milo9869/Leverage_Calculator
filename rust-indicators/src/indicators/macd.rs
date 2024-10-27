use wasm_bindgen::prelude::*;
use crate::models::types::MacdResult;
use crate::utils::math;

pub fn calculate_macd(
    data: &[f64], 
    fast_length: usize, 
    slow_length: usize, 
    signal_length: usize
) -> JsValue {
    let mut macd_result = MacdResult {
        macd_line: Vec::new(),
        signal_line: Vec::new(),
        histogram: Vec::new(),
    };

    // Calcul des EMAs
    let fast_ema = math::calculate_ema(data, fast_length);
    let slow_ema = math::calculate_ema(data, slow_length);

    let start_index = slow_length.max(fast_length) - 1;
    
    // Calcul ligne MACD
    for i in start_index..data.len() {
        let macd = fast_ema[i - (slow_length - fast_length)] - slow_ema[i];
        macd_result.macd_line.push(macd);
    }

    // Calcul ligne de signal (EMA du MACD)
    macd_result.signal_line = math::calculate_ema(&macd_result.macd_line, signal_length);

    // Calcul histogramme
    let signal_start = signal_length - 1;
    for i in signal_start..macd_result.macd_line.len() {
        let histogram = macd_result.macd_line[i] - macd_result.signal_line[i - signal_start];
        macd_result.histogram.push(histogram);
    }

    serde_wasm_bindgen::to_value(&macd_result).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_macd_calculation() {
        let data = vec![
            100.0, 101.0, 102.0, 101.0, 99.0, 98.0, 97.0, 98.0, 99.0, 100.0,
            101.0, 102.0, 103.0, 102.0, 101.0, 102.0, 103.0, 104.0, 105.0,
            106.0, 107.0, 108.0, 109.0, 110.0, 109.0, 108.0, 107.0
        ];
        
        let result: MacdResult = serde_wasm_bindgen::from_value(
            calculate_macd(&data, 12, 26, 9)
        ).unwrap();

        assert!(!result.macd_line.is_empty());
        assert!(!result.signal_line.is_empty());
        assert!(!result.histogram.is_empty());
    }
}