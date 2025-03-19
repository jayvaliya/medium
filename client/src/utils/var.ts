import axios from 'axios';

// API URLs
export const backend_url = "http://localhost:8787";
const prod_backend_url = import.meta.env.VITE_BACKEND_URL;

// Get the appropriate URL based on environment
export const getApiUrl = () => {
    return import.meta.env.VITE_MODE === 'production'
        ? prod_backend_url
        : backend_url;
};

// Create a preconfigured axios instance with logging
export const apiClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for authorization and logging
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    // Debug logging
    console.log("Making API request to:", config.url);
    console.log("Token present:", token ? "Yes" : "No");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => {
    console.error("API request interceptor error:", error);
    return Promise.reject(error);
});