const SET_FILES = 'SET_FILES';
const SET_CURRENT_DIR = 'SET_CURRENT_DIR';
const PUSH_TO_STACK = 'PUSH_TO_STACK';
const POP_FROM_STACK = 'POP_FROM_STACK';
const ADD_FILE = 'ADD_FILE';
const DELETE_FILE = 'DELETE_FILE';
const SET_SORT = 'SET_SORT';
const RESET_STACK = 'RESET_STACK';
const UPDATE_STACK = 'UPDATE_STACK';
const SET_VIEW = 'SET_VIEW';

const defaultState = {
	files: [],
	currentDir: { id: null, name: null },
	dirStack: [],
	sort: 'type',
	view: 'list',
	filesDownloadProgress: [],
};

const fileReducer = (state = defaultState, { type, payload }) => {
	switch (type) {
		case SET_FILES:
			return { ...state, files: payload };
		case SET_CURRENT_DIR:
			return { ...state, currentDir: payload };
		case PUSH_TO_STACK:
			return { ...state, dirStack: [...state.dirStack, payload] };
		case POP_FROM_STACK:
			return { ...state, currentDir: state.dirStack.pop() };
		case ADD_FILE:
			return { ...state, files: [...state.files, payload] };
		case DELETE_FILE:
			return { ...state, files: state.files.filter(f => f._id !== payload) };
		case SET_SORT:
			return { ...state, sort: payload };
		case RESET_STACK:
			return { ...state, currentDir: { id: null, name: null }, dirStack: [] };
		case UPDATE_STACK:
			return { ...state, dirStack: payload };
		case SET_VIEW:
			return { ...state, view: payload };
		default:
			return { ...state };
	}
};

const setFiles = files => ({ type: SET_FILES, payload: files });
const setCurrentDir = dir => ({ type: SET_CURRENT_DIR, payload: dir });
const pushToStack = dir => ({ type: PUSH_TO_STACK, payload: dir });
const popFromStack = () => ({ type: POP_FROM_STACK });
const addFile = file => ({ type: ADD_FILE, payload: file });
const fileDelete = fileId => ({ type: DELETE_FILE, payload: fileId });
const setSort = sortValue => ({ type: SET_SORT, payload: sortValue });
const resetStack = () => ({ type: RESET_STACK });
const updateStack = stack => ({ type: UPDATE_STACK, payload: stack });
const setView = view => ({ type: SET_VIEW, payload: view });

export {
	fileReducer as default,
	setFiles,
	setCurrentDir,
	pushToStack,
	popFromStack,
	addFile,
	fileDelete,
	setSort,
	resetStack,
	updateStack,
	setView,
};
