import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './base-query';
import { MB } from '../../utils/config';
import { IAuthorized, IUserAuthParams } from '../../types/user-types';

const userAPI = createApi({
	reducerPath: 'userAPI',
	baseQuery,
	tagTypes: ['userAPI'],
	endpoints: builder => ({
		checkAuth: builder.mutation<IAuthorized, null>({
			query: () => '/auth',
		}),
		authorize: builder.mutation<IAuthorized, IUserAuthParams>({
			query: ({ body, path }) => ({
				url: '/auth/' + path,
				method: 'POST',
				body,
			}),
		}),
		deleteAvatar: builder.mutation<IAuthorized, null>({
			query: () => ({
				url: '/file/avatar',
				method: 'DELETE',
			}),
		}),
		uploadAvatar: builder.mutation<IAuthorized, File>({
			query: file => {
				if (file.size > 2 * MB) {
					const alertText = 'Avatar size must be less than 2mb';
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
