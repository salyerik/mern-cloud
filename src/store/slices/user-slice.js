import { createSlice } from '@reduxjs/toolkit';
import userAPI from '../rtk-queries/user-query';

const initialState = { isAuth: false, currentUser: {} };

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logOut: state => {
			localStorage.removeItem('token');
			state.isAuth = false;
			state.currentUser = {};
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			userAPI.endpoints.authorized.matchFulfilled,
			(state, action) => {
				state.currentUser = action.payload.user;
				state.isAuth = true;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(
			userAPI.endpoints.checkAuth.matchFulfilled,
			(state, action) => {
				state.currentUser = action.payload.user;
				state.isAuth = true;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(userAPI.endpoints.checkAuth.matchRejected, state => {
			state.currentUser = {};
			state.isAuth = false;
			localStorage.removeItem('token');
		});
		builder.addMatcher(
			userAPI.endpoints.deleteAvatar.matchFulfilled,
			(state, action) => {
				state.currentUser = action.payload.user;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(
			userAPI.endpoints.uploadAvatar.matchFulfilled,
			(state, action) => {
				state.currentUser = action.payload.user;
				localStorage.setItem('token', action.payload.token);
			}
		);
	},
});

export const { logOut } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
