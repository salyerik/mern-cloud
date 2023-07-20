import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import fileReducer from './fileReducer.js';
import userReducer from './userReducer.js';
import appReducer from './appReducer.js';
import uploadReducer from './uploadReducer.js';

const root = combineReducers({
	app: appReducer,
	user: userReducer,
	file: fileReducer,
	upload: uploadReducer,
});

const store = createStore(root, composeWithDevTools(applyMiddleware(thunk)));

export default store;
