pub fn calculate_sma(data: &[f64], period: usize) -> Vec<f64> {
    if data.len() < period {
        return Vec::new();
    }

    let mut sma = Vec::with_capacity(data.len() - period + 1);
    let mut sum = data[0..period].iter().sum::<f64>();
    sma.push(sum / period as f64);

    for i in period..data.len() {
        sum = sum - data[i - period] + data[i];
        sma.push(sum / period as f64);
    }

    sma
}

pub fn calculate_ema(data: &[f64], period: usize) -> Vec<f64> {
    let multiplier = 2.0 / (period as f64 + 1.0);
    let mut ema = Vec::with_capacity(data.len());
    
    let initial_sma = data.iter().take(period).sum::<f64>() / period as f64;
    ema.push(initial_sma);
    
    for i in period..data.len() {
        let previous_ema = ema[ema.len() - 1];
        let current_ema = (data[i] - previous_ema) * multiplier + previous_ema;
        ema.push(current_ema);
    }
    
    ema
}

pub fn calculate_std_dev(data: &[f64], period: usize, sma: &[f64]) -> Vec<f64> {
    let mut std_dev = Vec::with_capacity(sma.len());

    for i in 0..sma.len() {
        let mut sum_sq_diff = 0.0;
        for j in 0..period {
            let diff = data[i + j] - sma[i];
            sum_sq_diff += diff * diff;
        }
        std_dev.push((sum_sq_diff / period as f64).sqrt());
    }

    std_dev
}