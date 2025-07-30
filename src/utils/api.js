
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// Set your base URL here
const BASE_URL = 'https://backend.seeb.in/partner'; // ✅ replace with real API

export const API_URL = 'https://backend.seeb.in/';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global error handler (optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Generic GET
export const get = (url, params = {}) => api.get(url, { params });

// Generic POST
export const post = (url, data, config = {}) => {
    return api.post(url, data, config);
};

// Generic PUT
export const put = (url, data) => api.put(url, data);

// Generic DELETE
export const del = (url) => api.delete(url);

export const getPartnerId = async () => {
    try {
        const partnerJson = await AsyncStorage.getItem('partner');
        const partner = partnerJson ? JSON.parse(partnerJson) : null;

        if (partner && partner.id) {
            // setPartnerId(partner.id);
            return partner.id;
        } else {
            console.warn('❌ Partner not found in storage');
            return null;
        }
    } catch (error) {
        console.error('🔥 Error getting partner ID:', error);
        return null;
    }
};

// Direct axios instance (if needed)
export default api;
