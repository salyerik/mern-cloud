import { createSlice } from '@reduxjs/toolkit';

const initialState = { isUploaderVisible: false, uploadingFiles: [] };

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		hideUploader: state => {
			state.isUploaderVisible = false;
			state.uploadingFiles = [];
		},
		uploadFile: (state, action) => {
			state.isUploaderVisible = true;
			state.uploadingFiles.push(action.payload);
		},
		hideFile: (state, action) => {
			state.isUploaderVisible = !!(state.uploadingFiles.length - 1);
			state.uploadingFiles = state.uploadingFiles.filter(
				file => file.id !== action.payload
			);
		},
		changeUploadProgress: (state, action) => {
			const file = state.uploadingFiles.find(
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
