// src/components/CryptoList.js (updated with pagination and more info)
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../features/cryptoSlice';
import { Link } from 'react-router-dom';

const CryptoList = () => {
  const dispatch = useDispatch();
  const { coins, loading } = useSelector((state) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCryptoData());
  }, [dispatch]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading cryptocurrencies...</div>;

  return (
    <div className="crypto-list">
      <h2 className="crypto-list-title">Cryptocurrency Explorer</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="crypto-grid">
        {currentCoins.map((coin) => (
          <Link key={coin.id} to={`/crypto/${coin.id}`} className="crypto-card">
            <div className="card-header">
              <img src={coin.image} alt={coin.name} className="crypto-icon" />
              <div className="crypto-name">
                <h4>{coin.name}</h4>
                <span className="symbol">{coin.symbol.toUpperCase()}</span>
              </div>
            </div>
            <div className="card-body">
              <p className="price">Price: ${coin.current_price.toLocaleString()}</p>
              <p className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                24h: {coin.price_change_percentage_24h?.toFixed(2)}%
              </p>
              <p className="volume">24h Vol: ${(coin.total_volume / 1000000).toFixed(2)}M</p>
              <p className="supply">Circ. Supply: {(coin.circulating_supply / 1000000).toFixed(2)}M</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoList;