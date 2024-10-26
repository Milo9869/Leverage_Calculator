use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct TechnicalAnalysis {
    data: Vec<f64>,
}

#[wasm_bindgen]
impl TechnicalAnalysis {
    #[wasm_bindgen(constructor)]
    pub fn new(prices: Vec<f64>) -> TechnicalAnalysis {
        TechnicalAnalysis { data: prices }
    }

    pub fn get_data_length(&self) -> usize {
        self.data.len()
    }

    // Nous ajouterons les méthodes pour les indicateurs ici
}

// Fonction utilitaire pour le logging
#[wasm_bindgen]
pub fn init_panic_hook() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}