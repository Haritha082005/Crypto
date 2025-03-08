// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/Home';
import CryptoList from './components/CryptoList';
import CryptoDetails from './components/CryptoDetails';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Cryptoverse</h1>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cryptocurrencies" element={<CryptoList />} />
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;