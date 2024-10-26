import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

const CryptoTracker = ({ onSelectCrypto }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h,7d'
        );
        
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la récupération des données');
        }
        
        const data = await response.json();
        setCryptoData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des données: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = cryptoData.filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, cryptoData]);

  const formatNumber = (number, minimumFractionDigits = 2) => {
    if (number === null || number === undefined) return 'N/A';
    
    if (number >= 1e9) {
      return `${(number / 1e9).toFixed(2)}Md €`;
    } else if (number >= 1e6) {
      return `${(number / 1e6).toFixed(2)}M €`;
    } else if (number >= 1e3) {
      return `${(number / 1e3).toFixed(2)}k €`;
    }
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits
    }).format(number);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  if (loading) return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Top 50 Cryptomonnaies</CardTitle>
        <div className="w-72">
          <Input
            type="text"
            placeholder="Rechercher une crypto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Crypto</th>
                <th className="p-4 text-right">Prix</th>
                <th className="p-4 text-right">24h %</th>
                <th className="p-4 text-right">7j %</th>
                <th className="p-4 text-right">Volume (24h)</th>
                <th className="p-4 text-right">Cap. Marché</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((crypto, index) => (
                <tr 
                  key={crypto.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => onSelectCrypto(crypto)}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name} 
                        className="w-6 h-6"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'fallback-image-url.png'; // URL d'une image par défaut
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{crypto.name}</span>
                        <span className="text-gray-500 text-sm">{crypto.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatNumber(crypto.current_price)}
                  </td>
                  <td className={`p-4 text-right font-medium ${
                    crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </td>
                  <td className={`p-4 text-right font-medium ${
                    crypto.price_change_percentage_7d_in_currency > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {formatNumber(crypto.total_volume)}
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {formatNumber(crypto.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Données mises à jour toutes les 30 secondes • {filteredData.length} cryptomonnaies affichées
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoTracker;