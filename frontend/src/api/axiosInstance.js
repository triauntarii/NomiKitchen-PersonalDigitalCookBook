import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Interceptor untuk menyisipkan token JWT secara otomatis jika ada
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;