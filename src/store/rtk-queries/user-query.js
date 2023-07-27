import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './base-query';
import { MB } from '../../utils/config';

const userAPI = createApi({
	reducerPath: 'userAPI',
	baseQuery,
	tagTypes: ['userAPI'],
	endpoints: builder => ({
		checkAuth: builder.query({
			query: () => '/auth',
		}),
		authorized: builder.mutation({
			query: ({ body, path }) => ({
				url: '/auth/' + path,
				method: 'POST',
				body,
			}),
		}),
		deleteAvatar: builder.mutation({
			query: () => ({
				url: '/file/avatar',
				method: 'DELETE',
			}),
		}),
		uploadAvatar: builder.mutation({
			query: file => {
				if (file.size > 2 * MB) {
					const alertText = 'Picture size must be less than 2mb';
					alert(alertText);
					throw alertText;
				}
				const formData = new FormData();
				formData.append('file', file);
				return {
					url: '/file/avatar',
					method: 'POST',
					body: formData,
				};
			},
		}),
	}),
});

export default userAPI;
