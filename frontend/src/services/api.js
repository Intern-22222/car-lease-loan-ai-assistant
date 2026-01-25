import axios from 'axios';

// Point this back to your functional backend (e.g., FastAPI on 8000)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REMOVED: Authentication Interceptors
// Since we are not using backend auth, we don't need to attach tokens

export const api = {
  // --- 1. Upload Logic ---
  uploadLease: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- 2. Market Check Logic ---
  getMarketAnalysis: async (vin, price) => {
    return await apiClient.get(`/market-info/${vin}`, {
      params: { contract_price: price },
    });
  },

  // --- 3. Chat Logic ---
  sendChatMessage: async (message, filename) => {
    // filename can be null for general inquiries
    return await apiClient.post('/chat', { message, filename });
  },
};






// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const api = {
//   // 1. Upload logic (used in Sidebar or SummaryPanel)
//   uploadLease: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return await apiClient.post('/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//   },

//   // 2. Market Check logic (used in VinPriceCheck)
//   getMarketAnalysis: async (vin, price) => {
//     return await apiClient.get(`/market-info/${vin}`, {
//       params: { contract_price: price },
//     });
//   },

//   // 3. Chat logic (used in ChatWindow)
//   sendChatMessage: async (message, filename) => {
//     return await apiClient.post('/chat', { message, filename });
//   },
// };