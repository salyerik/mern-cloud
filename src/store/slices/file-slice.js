import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
		setFiles(state, action) {
			state.files = action.payload;
		},
		setCurrentDir(state, action) {
			state.currentDir = action.payload;
		},
		pushToStack(state, action) {
			state.dirStack.push(action.payload);
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
		resetStack(state) {
			state.currentDir = initialState.currentDir;
			state.dirStack = [];
		},
		updateStack(state, action) {
			state.dirStack = action.payload;
		},
		setView(state, action) {
			state.view = action.payload;
		},
		updateDownloadingProgress(state, action) {
			const file = state.files.find(f => f._id === action.payload.id);
			file.downloadProgress = action.payload.progress;
		},
		resetDownloadingProgress(state, action) {
			const file = state.files.find(f => f._id === action.payload);
			file.downloadProgress = null;
		},
	},
});

export const {
	setFiles,
	setCurrentDir,
	pushToStack,
	popFromStack,
	addFile,
	deleteFile,
	setSort,
	resetStack,
	updateStack,
	setView,
	updateDownloadingProgress,
	resetDownloadingProgress,
} = fileSlice.actions;

const fileReducer = fileSlice.reducer;

export default fileReducer;
