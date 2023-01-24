import axios from 'axios'
import { SERVER_URL } from './configs'

const axiosInstance = axios.create({ baseURL: SERVER_URL, withCredentials: true })

axiosInstance.interceptors.request.use(config => {
	config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
	return config
})

export default axiosInstance
