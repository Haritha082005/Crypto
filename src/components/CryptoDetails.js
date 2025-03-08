// src/components/CryptoDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCryptoDetails, fetchCryptoHistory } from '../features/cryptoSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoDetails = () => {
  const { coinId } = useParams();
  const dispatch = useDispatch();
  const { coinDetails, history, loading } = useSelector((state) => state.crypto);
  const [timeFrame, setTimeFrame] = useState('30');
  const [fiveYearData, setFiveYearData] = useState(null);

  useEffect(() => {
    dispatch(fetchCryptoDetails(coinId));
    
    if (timeFrame === '1825') {
      // Fetch 5 years of data and split into yearly chunks
      dispatch(fetchCryptoHistory({ coinId, days: 1825 })).then((response) => {
        if (response.payload && response.payload.prices) {
          const prices = response.payload.prices;
          // Split into 5 yearly datasets (approximately 365 days each)
          const yearlyData = [];
          for (let i = 0; i < 5; i++) {
            const startIdx = i * 365;
            const endIdx = (i + 1) * 365;
            yearlyData.push(prices.slice(startIdx, endIdx));
          }
          setFiveYearData(yearlyData.reverse()); // Reverse to show most recent first
        }
      });
    } else {
      dispatch(fetchCryptoHistory({ coinId, days: timeFrame }));
      setFiveYearData(null);
    }
  }, [dispatch, coinId, timeFrame]);

  if (loading || !coinDetails) return <div>Loading...</div>;

  const getChartData = (prices) => ({
    labels: prices.map((price) => new Date(price[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'Price (USD)',
        data: prices.map((price) => price[1]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
    },
  };

  return (
    <div className="crypto-details">
      <h2>{coinDetails.name}</h2>
      <img src={coinDetails.image.large} alt={coinDetails.name} width="100" />
      <p>Current Price: ${coinDetails.market_data.current_price.usd}</p>
      <p>Market Cap: ${coinDetails.market_data.market_cap.usd.toLocaleString()}</p>
      
      <div className="timeframe-selector">
        <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="1">1 Day</option>
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="365">1 Year</option>
          <option value="1825">5 Years</option>
        </select>
      </div>

      <div className="charts-container">
        {timeFrame === '1825' && fiveYearData ? (
          fiveYearData.map((yearData, index) => (
            <div key={index} className="year-chart">
              <h3>Year {5 - index} Ago</h3>
              <div style={{ height: '300px' }}>
                <Line data={getChartData(yearData)} options={chartOptions} />
              </div>
            </div>
          ))
        ) : history ? (
          <div style={{ height: '400px' }}>
            <Line data={getChartData(history.prices)} options={chartOptions} />
          </div>
        ) : (
          <div>Loading chart...</div>
        )}
      </div>

      <div className="links">
        <h3>Links</h3>
        <a href={coinDetails.links.homepage[0]} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </div>
    </div>
  );
};

export default CryptoDetails;