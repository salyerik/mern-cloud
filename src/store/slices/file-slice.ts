import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import fileAPI from '../rtk-queries/file-query';
import { IDir, IFile, IFileSlice, ISort, IView } from '../../types/file-types';

const initialState: IFileSlice = {
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
		openDir(state, action: PayloadAction<IDir>) {
			state.dirStack.push(state.currentDir);
			state.currentDir = action.payload;
		},
		popFromStack(state) {
			const poppedDir = state.dirStack.pop();
			if (poppedDir) state.currentDir = poppedDir;
		},
		addFile(state, action: PayloadAction<IFile>) {
			state.files.push(action.payload);
		},
		deleteFile(state, action: PayloadAction<string>) {
			state.files = state.files.filter(f => f._id !== action.payload);
		},
		setSort(state, action: PayloadAction<ISort>) {
			state.sort = action.payload;
		},
		changeFolder(state, action: PayloadAction<IDir>) {
			const newStack = [] as IDir[];
			for (let i = 0; i < state.dirStack.length; i++) {
				const stackDir = state.dirStack[i];
				if (action.payload.id === stackDir.id) break;
				newStack.push(stackDir);
			}
			state.dirStack = newStack;
			state.currentDir = action.payload;
		},
		setView(state, action: PayloadAction<IView>) {
			state.view = action.payload;
		},
		updateDownloadingProgress(
			state,
			action: PayloadAction<{ id: string; progress: number }>
		) {
			const file = state.files.find(f => f._id === action.payload.id);
			if (file) file.downloadProgress = action.payload.progress;
		},
		resetDownload(state, action: PayloadAction<string>) {
			const file = state.files.find(f => f._id === action.payload);
			if (file) file.downloadProgress = null;
		},
		togglePopup(state) {
			state.isPopupVisible = !state.isPopupVisible;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			fileAPI.endpoints.createDir.matchFulfilled,
			(state, action: PayloadAction<IFile>) => {
				state.files.push(action.payload);
				state.isPopupVisible = false;
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.getFileUrl.matchFulfilled,
			(state, action: PayloadAction<string>) => {
				const link = document.createElement('a');
				link.href = action.payload;
				link.target = '_blank';
				link.click();
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.deleteFile.matchFulfilled,
			(state, action: PayloadAction<{ id: string; message: string }>) => {
				state.files = state.files.filter(f => f._id !== action.payload.id);
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.deleteFile.matchRejected,
			(
				state,
				action: PayloadAction<
					{ data: string } | undefined | FetchBaseQueryError
				>
			) => {
				alert(action.payload?.data);
			}
		);
		builder.addMatcher(
			fileAPI.endpoints.getFiles.matchFulfilled,
			(state, action: PayloadAction<IFile[]>) => {
				state.files = action.payload;
			}
		);
		builder.addMatcher(fileAPI.endpoints.searchFile.matchPending, state => {
			state.currentDir = initialState.currentDir;
			state.dirStack = [] as IDir[];
		});
		builder.addMatcher(
			fileAPI.endpoints.searchFile.matchFulfilled,
			(state, action: PayloadAction<IFile[]>) => {
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
