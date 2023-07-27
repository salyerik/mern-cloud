import axios from 'axios';
import { API_URL } from './config';

const axiosInstance = axios.create({ baseURL: API_URL, withCredentials: true });

axiosInstance.interceptors.request.use(config => {
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
	return config;
});

export default axiosInstance;
