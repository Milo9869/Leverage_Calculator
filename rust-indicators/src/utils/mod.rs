pub mod math;

// Re-export des fonctions mathématiques couramment utilisées
pub use math::{
    calculate_sma,
    calculate_ema,
    calculate_std_dev,
};

// Fonctions utilitaires générales
pub mod helpers {
    use wasm_bindgen::prelude::*;

    // Formatage des nombres pour l'affichage
    pub fn format_decimal(value: f64, decimals: usize) -> String {
        format!("{:.1$}", value, decimals)
    }

    // Conversion de pourcentage
    pub fn to_percentage(value: f64) -> f64 {
        value * 100.0
    }

    // Validation des données d'entrée
    pub fn validate_data_length(data: &[f64], min_length: usize) -> Result<(), JsError> {
        if data.len() < min_length {
            return Err(JsError::new(&format!(
                "Données insuffisantes. Minimum requis : {}", min_length
            )));
        }
        Ok(())
    }

    // Normalisation des données
    pub fn normalize_data(data: &[f64]) -> Vec<f64> {
        if data.is_empty() {
            return Vec::new();
        }

        let min = data.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max = data.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        let range = max - min;

        if range == 0.0 {
            return vec![0.0; data.len()];
        }

        data.iter().map(|&x| (x - min) / range).collect()
    }

    // Détection des croisements
    pub fn detect_crossover(line1: &[f64], line2: &[f64]) -> Vec<bool> {
        if line1.len() != line2.len() || line1.len() < 2 {
            return Vec::new();
        }

        let mut crossovers = Vec::with_capacity(line1.len());
        crossovers.push(false); // Premier point ne peut pas être un croisement

        for i in 1..line1.len() {
            let prev_diff = line1[i-1] - line2[i-1];
            let curr_diff = line1[i] - line2[i];
            crossovers.push(prev_diff * curr_diff <= 0.0 && prev_diff != curr_diff);
        }

        crossovers
    }
}

#[cfg(test)]
mod tests {
    use super::helpers::*;

    #[test]
    fn test_format_decimal() {
        assert_eq!(format_decimal(3.14159, 2), "3.14");
        assert_eq!(format_decimal(2.0, 3), "2.000");
    }

    #[test]
    fn test_normalize_data() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let normalized = normalize_data(&data);
        assert!((normalized[0] - 0.0).abs() < f64::EPSILON);
        assert!((normalized[4] - 1.0).abs() < f64::EPSILON);
    }

    #[test]
    fn test_detect_crossover() {
        let line1 = vec![1.0, 2.0, 3.0, 2.0, 1.0];
        let line2 = vec![3.0, 2.5, 2.0, 1.5, 1.0];
        let crossovers = detect_crossover(&line1, &line2);
        assert_eq!(crossovers.len(), line1.len());
        assert!(crossovers[2]); // Croisement au point 3
    }

    #[test]
    fn test_validate_data_length() {
        let data = vec![1.0, 2.0, 3.0];
        assert!(validate_data_length(&data, 3).is_ok());
        assert!(validate_data_length(&data, 4).is_err());
    }
}