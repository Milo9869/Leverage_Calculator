use wasm_bindgen::prelude::*;
use crate::models::types::{FibonacciLevels, FibonacciLevel};

pub fn calculate_fibonacci(data: &[f64], window_size: usize) -> JsValue {
    let (swing_high, swing_low) = find_pivot_points(data, window_size);
    let price_range = swing_high - swing_low;
    let fib_ratios = [0.0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.618, 2.618];
    
    let current_price = data[data.len() - 1];
    let trend = if current_price > (swing_high + swing_low) / 2.0 {
        "haussière".to_string()
    } else {
        "baissière".to_string()
    };

    let mut levels = Vec::new();
    
    for &ratio in fib_ratios.iter() {
        let price = if trend == "haussière" {
            swing_high - (price_range * ratio)
        } else {
            swing_low + (price_range * ratio)
        };

        let strength = determine_level_strength(ratio);
        let type_level = determine_level_type(ratio);

        levels.push(FibonacciLevel {
            ratio,
            price,
            type_level: type_level.to_string(),
            strength: strength.to_string(),
        });
    }

    let fib_levels = FibonacciLevels {
        levels,
        trend,
        swing_high,
        swing_low,
    };

    serde_wasm_bindgen::to_value(&fib_levels).unwrap()
}

fn find_pivot_points(data: &[f64], window_size: usize) -> (f64, f64) {
    if data.len() < window_size {
        return (0.0, 0.0);
    }

    let mut swing_high = f64::NEG_INFINITY;
    let mut swing_low = f64::INFINITY;

    for i in window_size..data.len() {
        let window = &data[i - window_size..=i];
        let current = data[i];

        if current > *window[..window.len()-1].iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap() {
            if current > swing_high {
                swing_high = current;
            }
        }

        if current < *window[..window.len()-1].iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap() {
            if current < swing_low {
                swing_low = current;
            }
        }
    }

    (swing_high, swing_low)
}

fn determine_level_strength(ratio: f64) -> &'static str {
    match ratio {
        r if r == 0.382 || r == 0.618 => "Fort",
        r if r == 0.5 || r == 0.786 => "Moyen",
        _ => "Normal"
    }
}

fn determine_level_type(ratio: f64) -> &'static str {
    match ratio {
        r if r <= 0.382 => "Support",
        r if r >= 0.618 => "Résistance",
        _ => "Pivot"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fibonacci_calculation() {
        let data = vec![
            100.0, 105.0, 110.0, 115.0, 120.0, 115.0, 110.0, 105.0, 100.0,
            95.0, 90.0, 85.0, 90.0, 95.0, 100.0, 105.0, 110.0, 115.0
        ];

        let result: FibonacciLevels = serde_wasm_bindgen::from_value(
            calculate_fibonacci(&data, 10)
        ).unwrap();

        assert!(!result.levels.is_empty());
        assert!(result.swing_high > result.swing_low);
    }

    #[test]
    fn test_level_classifications() {
        assert_eq!(determine_level_strength(0.382), "Fort");
        assert_eq!(determine_level_strength(0.5), "Moyen");
        assert_eq!(determine_level_strength(0.236), "Normal");

        assert_eq!(determine_level_type(0.236), "Support");
        assert_eq!(determine_level_type(0.5), "Pivot");
        assert_eq!(determine_level_type(0.786), "Résistance");
    }
}