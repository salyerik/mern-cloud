import { createSlice } from '@reduxjs/toolkit';
import fileAPI from '../rtk-queries/file-query';

const initialState = {
	isPopupVisible: false,
	files: [],
	currentDir: { id: null, name: null },
	dirStack: [],
	sort: 'type',
	view: 'list',
};

const fileSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		openDir(state, action) {
			state.dirStack.push(state.currentDir);
			state.currentDir = action.payload;
		},
		popFromStack(state) {
			state.currentDir = state.dirStack.pop();
		},
		addFile(state, action) {
			state.files.push(action.payload);
		},
		deleteFile(state, action) {
			state.files = state.files.filter(f => f._id !== action.payload);
		},
		setSort(state, action) {
			state.sort = action.payload;
		},
		changeFolder(state, action) {
			const newStack = [];
			for (let i = 0; i < state.dirStack.length; i++) {
				const stackDir = state.dirStack[i];
				if (action.payload.id === stackDir.id) break;
				newStack.push(stackDir);
			}
			state.dirStack = newStack;
			state.currentDir = action.payload;
		},
		setView(state, action) {
			state.view = action.payload;
		},
		updateDownloadingProgress(state, action) {
			const file = state.files.find(f => f._id === action.payload.id);
			file.downloadProgress = action.payload.progress;
		},
		resetDownload(state, action) {
			const file = state.files.find(f => f._id === action.payload);
			file.downloadProgress = null;
		},
		togglePopup(state) {
			state.isPopupVisible = !state.isPopupVisible;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			fileAPI.endpoints.createDir.matchFulfilled,
			(state, action) => {
				state.files.push(action.payload);
				state.isPopupVisible = false;
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.getFileUrl.matchFulfilled,
			(state, action) => {
				const link = document.createElement('a');
				link.href = action.payload;
				link.target = '_blank';
				link.click();
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.deleteFile.matchFulfilled,
			(state, action) => {
				state.files = state.files.filter(f => f._id !== action.payload.id);
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.deleteFile.matchRejected,
			(state, action) => {
				alert(action.payload.data);
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.getFiles.matchFulfilled,
			(state, action) => {
				state.files = action.payload;
			}
		);
		builder.addMatcher(fileAPI.endpoints.searchFile.matchPending, state => {
			state.currentDir = initialState.currentDir;
			state.dirStack = [];
		});
		builder.addMatcher(
			fileAPI.endpoints.searchFile.matchFulfilled,
			(state, action) => {
				state.files = action.payload;
			}
		);
	},
});

export const {
	openDir,
	popFromStack,
	addFile,
	deleteFile,
	setSort,
	changeFolder,
	setView,
	updateDownloadingProgress,
	resetDownload,
	togglePopup,
} = fileSlice.actions;

const fileReducer = fileSlice.reducer;

export default fileReducer;
