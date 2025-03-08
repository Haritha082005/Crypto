// src/features/cryptoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = createAsyncThunk('crypto/fetchData', async () => {
  const response = await axios.get(`${API_URL}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: true,
    },
  });
  return response.data;
});

export const fetchCryptoDetails = createAsyncThunk('crypto/fetchDetails', async (coinId) => {
  const response = await axios.get(`${API_URL}/coins/${coinId}`, {
    params: {
      sparkline: true,
      market_data: true,
      community_data: true,
      developer_data: true,
    },
  });
  return response.data;
});

export const fetchCryptoHistory = createAsyncThunk('crypto/fetchHistory', async ({ coinId, days }) => {
  const response = await axios.get(`${API_URL}/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days,
    },
  });
  return response.data;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    coins: [],
    coinDetails: null,
    history: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.coinDetails = action.payload;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      });
  },
});

export default cryptoSlice.reducer;