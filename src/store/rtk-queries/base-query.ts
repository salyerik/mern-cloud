import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/config';

const baseQuery = fetchBaseQuery({
	baseUrl: API_URL,
	credentials: 'include',
	prepareHeaders: headers => {
		const token = localStorage.getItem('token');
		if (token) headers.set('authorization', `Bearer ${token}`);
	},
});

export default baseQuery;
