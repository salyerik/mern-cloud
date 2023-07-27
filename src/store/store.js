import { configureStore } from '@reduxjs/toolkit';

import fileReducer from './slices/file-slice';
import uploadReducer from './slices/upload-slice';
import userReducer from './slices/user-slice';

import userAPI from './rtk-queries/user-query';
import fileAPI from './rtk-queries/file-query';

const store = configureStore({
	reducer: {
		user: userReducer,
		upload: uploadReducer,
		file: fileReducer,
		[userAPI.reducerPath]: userAPI.reducer,
		[fileAPI.reducerPath]: fileAPI.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat([userAPI.middleware, fileAPI.middleware]),
});

export default store;
