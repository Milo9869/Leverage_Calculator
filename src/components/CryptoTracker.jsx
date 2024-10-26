import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const CryptoTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await response.json();
        setCryptoData(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <p className="text-center">Chargement des données...</p>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <p className="text-center text-red-500">{error}</p>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Suivi des Cryptomonnaies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Crypto</th>
                <th className="p-4 text-right">Prix</th>
                <th className="p-4 text-right">24h %</th>
                <th className="p-4 text-right">Volume 24h</th>
                <th className="p-4 text-right">Cap. Marché</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto) => (
                <tr key={crypto.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-gray-500 text-sm">({crypto.symbol.toUpperCase()})</span>
                  </td>
                  <td className="p-4 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(crypto.current_price)}
                  </td>
                  <td className={`p-4 text-right ${crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="p-4 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(crypto.total_volume)}
                  </td>
                  <td className="p-4 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(crypto.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoTracker;