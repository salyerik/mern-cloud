import { createSlice } from '@reduxjs/toolkit';

const initialState = { isUploaderVisible: false, uploadFiles: [] };

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		showUploader: state => {
			state.isUploaderVisible = true;
		},
		hideUploader: state => {
			state.isUploaderVisible = false;
			state.uploadFiles = [];
		},
		uploadFile: (state, action) => {
			state.isUploaderVisible = true;
			state.uploadFiles.push(action.payload);
		},
		hideFile: (state, action) => {
			state.isUploaderVisible = !!(state.uploadFiles.length - 1);
			state.uploadFiles = state.uploadFiles.filter(
				file => file.id !== action.payload
			);
		},
		changeUploadProgress: (state, action) => {
			const file = state.uploadFiles.find(
				file => file.id === action.payload.id
			);
			file.progress = action.payload.progress;
		},
	},
});

export const { hideUploader, uploadFile, changeUploadProgress, hideFile } =
	uploadSlice.actions;
const uploadReducer = uploadSlice.reducer;
export default uploadReducer;
