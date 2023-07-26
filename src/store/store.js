import { configureStore } from '@reduxjs/toolkit';

import appReducer from './slices/app-slice';
import fileReducer from './slices/file-slice';
import uploadReducer from './slices/upload-slice';
import userReducer from './slices/user-slice';

const store = configureStore({
	reducer: {
		app: appReducer,
		user: userReducer,
		file: fileReducer,
		upload: uploadReducer,
	},
});

export default store;
