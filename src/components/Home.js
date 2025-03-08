// src/components/Home.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../features/cryptoSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { coins, loading } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoData());
  }, [dispatch]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <h2>Global Crypto Stats</h2>
      <h3>Top 10 Cryptocurrencies</h3>
      <div className="crypto-grid">
        {coins.slice(0, 10).map((coin) => (
          <Link key={coin.id} to={`/crypto/${coin.id}`} className="crypto-card">
            <img src={coin.image} alt={coin.name} className="crypto-icon" />
            <div className="crypto-name">
              <h4>{coin.name}</h4>
              <span className="symbol">{coin.symbol.toUpperCase()}</span>
            </div>
            <div className="card-body">
              <p className="price">${coin.current_price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/cryptocurrencies" className="home-link">View All Cryptocurrencies</Link>
    </div>
  );
};

export default Home;