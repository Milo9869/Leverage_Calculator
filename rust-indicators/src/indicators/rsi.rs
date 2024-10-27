use wasm_bindgen::prelude::*;
use js_sys::Array;
use crate::utils::math;

pub fn calculate_rsi(data: &[f64], period: usize) -> Array {
    if data.len() <= period {
        return Array::new();
    }

    let mut gains = Vec::new();
    let mut losses = Vec::new();
    let mut rsi_values = Vec::new();

    // Calcul des variations
    for i in 1..data.len() {
        let difference = data[i] - data[i - 1];
        gains.push(f64::max(difference, 0.0));
        losses.push(f64::max(-difference, 0.0));
    }

    // Moyenne initiale
    let mut avg_gain = gains[0..period].iter().sum::<f64>() / period as f64;
    let mut avg_loss = losses[0..period].iter().sum::<f64>() / period as f64;

    let mut rsi = 100.0 - (100.0 / (1.0 + (avg_gain / avg_loss)));
    rsi_values.push(rsi);

    // Calculs suivants
    for i in period..gains.len() {
        avg_gain = ((avg_gain * (period - 1) as f64) + gains[i]) / period as f64;
        avg_loss = ((avg_loss * (period - 1) as f64) + losses[i]) / period as f64;

        rsi = if avg_loss == 0.0 {
            100.0
        } else {
            100.0 - (100.0 / (1.0 + (avg_gain / avg_loss)))
        };
        
        rsi_values.push(rsi);
    }

    rsi_values.into_iter().map(JsValue::from).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rsi_calculation() {
        let data = vec![
            100.0, 101.0, 102.0, 101.0, 99.0, 98.0, 97.0, 98.0, 99.0, 100.0,
            101.0, 102.0, 103.0, 102.0, 101.0
        ];
        let rsi = calculate_rsi(&data, 14);
        assert!(rsi.length() > 0);
    }
}