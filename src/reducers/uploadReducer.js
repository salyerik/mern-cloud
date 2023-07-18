const UPLOADER_SHOW = 'UPLOADER_SHOW';
const UPLOADER_HIDE = 'UPLOADER_HIDE';
const UPLOAD_FILE = 'UPLOAD_FILE';
const HIDE_FILE = 'HIDE_FILE';
const CHANGE_UPLOAD_PROGRESS = 'CHANGE_UPLOAD_PROGRESS';

const defaultState = { isUploaderVisible: false, uploadFiles: [] };

const uploadReducer = (state = defaultState, { type, payload }) => {
	switch (type) {
		case UPLOADER_SHOW:
			return { ...state, isUploaderVisible: true };
		case UPLOADER_HIDE:
			return { isUploaderVisible: false, uploadFiles: [] };
		case UPLOAD_FILE:
			return {
				isUploaderVisible: true,
				uploadFiles: [...state.uploadFiles, payload],
			};
		case HIDE_FILE:
			return {
				isUploaderVisible: !!(state.uploadFiles.length - 1),
				uploadFiles: state.uploadFiles.filter(file => file.id !== payload),
			};
		case CHANGE_UPLOAD_PROGRESS:
			return {
				...state,
				uploadFiles: state.uploadFiles.map(file =>
					file.id === payload.fileId
						? { ...file, progress: payload.progress }
						: file
				),
			};
		default:
			return { ...state };
	}
};

const showUploader = () => ({ type: UPLOADER_SHOW });
const hideUploader = () => ({ type: UPLOADER_HIDE });
const uploadFile = file => ({ type: UPLOAD_FILE, payload: file });
const hideFile = fileId => ({ type: HIDE_FILE, payload: fileId });
const changeUploadProgress = (fileId, progress) => ({
	type: CHANGE_UPLOAD_PROGRESS,
	payload: { fileId, progress },
});

export {
	uploadReducer as default,
	showUploader,
	hideUploader,
	uploadFile,
	hideFile,
	changeUploadProgress,
};
