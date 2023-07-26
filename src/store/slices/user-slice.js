import { createSlice } from '@reduxjs/toolkit';

const initialState = { isAuth: false, currentUser: {} };

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.isAuth = true;
			state.currentUser = action.payload;
		},
		logOut: state => {
			state.isAuth = false;
			state.currentUser = {};
		},
	},
});

export const { setUser, logOut } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
