use wasm_bindgen::prelude::*;
use crate::models::types::BollingerBands;
use crate::utils::math;

pub fn calculate_bollinger(data: &[f64], period: usize, num_std_dev: f64) -> JsValue {
    let sma = math::calculate_sma(data, period);
    let std_dev = math::calculate_std_dev(data, period, &sma);

    let mut bollinger = BollingerBands {
        upper_band: Vec::with_capacity(sma.len()),
        middle_band: sma.clone(),
        lower_band: Vec::with_capacity(sma.len()),
        bandwidth: Vec::with_capacity(sma.len()),
        percent_b: Vec::with_capacity(sma.len())
    };

    for i in 0..sma.len() {
        let upper = sma[i] + num_std_dev * std_dev[i];
        let lower = sma[i] - num_std_dev * std_dev[i];
        
        bollinger.upper_band.push(upper);
        bollinger.lower_band.push(lower);
        
        // Calcul du Bandwidth
        let bandwidth = (upper - lower) / sma[i] * 100.0;
        bollinger.bandwidth.push(bandwidth);

        // Calcul du %B
        let current_price = data[i + period - 1];
        let percent_b = (current_price - lower) / (upper - lower) * 100.0;
        bollinger.percent_b.push(percent_b);
    }

    serde_wasm_bindgen::to_value(&bollinger).unwrap()
}

pub fn interpret_volatility(bandwidth: f64) -> &'static str {
    match bandwidth {
        b if b > 30.0 => "Volatilité élevée",
        b if b < 10.0 => "Volatilité faible",
        _ => "Volatilité normale"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bollinger_calculation() {
        let data = vec![
            100.0, 101.0, 102.0, 101.0, 99.0, 98.0, 97.0, 98.0, 99.0, 100.0,
            101.0, 102.0, 103.0, 102.0, 101.0, 102.0, 103.0, 104.0, 105.0,
            106.0, 107.0, 108.0, 109.0, 110.0
        ];

        let result: BollingerBands = serde_wasm_bindgen::from_value(
            calculate_bollinger(&data, 20, 2.0)
        ).unwrap();

        assert!(!result.upper_band.is_empty());
        assert!(!result.middle_band.is_empty());
        assert!(!result.lower_band.is_empty());
        assert!(!result.bandwidth.is_empty());
        assert!(!result.percent_b.is_empty());
    }

    #[test]
    fn test_volatility_interpretation() {
        assert_eq!(interpret_volatility(35.0), "Volatilité élevée");
        assert_eq!(interpret_volatility(8.0), "Volatilité faible");
        assert_eq!(interpret_volatility(15.0), "Volatilité normale");
    }
}