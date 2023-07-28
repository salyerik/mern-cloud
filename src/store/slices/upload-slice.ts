import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUploadSlice, IUploadingFile } from '../../types/upload-types';

const initialState: IUploadSlice = {
	isUploaderVisible: false,
	uploadingFiles: [] as IUploadingFile[],
};

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		hideUploader: state => {
			state.isUploaderVisible = false;
			state.uploadingFiles = [] as IUploadingFile[];
		},
		uploadFile: (state, action: PayloadAction<IUploadingFile>) => {
			state.isUploaderVisible = true;
			state.uploadingFiles.push(action.payload);
		},
		hideFile: (state, action: PayloadAction<string>) => {
			state.isUploaderVisible = !!(state.uploadingFiles.length - 1);
			state.uploadingFiles = state.uploadingFiles.filter(
				file => file.id !== action.payload
			);
		},
		changeUploadProgress: (state, action: PayloadAction<IUploadingFile>) => {
			const file = state.uploadingFiles.find(
				file => file.id === action.payload.id
			);
			if (file) file.progress = action.payload.progress;
		},
	},
});

export const { hideUploader, uploadFile, changeUploadProgress, hideFile } =
	uploadSlice.actions;
const uploadReducer = uploadSlice.reducer;
export default uploadReducer;
