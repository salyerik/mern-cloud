import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import userAPI from '../rtk-queries/user-query';
import { IAuthorized, IUser, IUserSlice } from '../../types/user-types';

const initialState: IUserSlice = { isAuth: false, currentUser: {} as IUser };

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logOut: state => {
			localStorage.removeItem('token');
			state.isAuth = false;
			state.currentUser = {} as IUser;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			userAPI.endpoints.authorize.matchFulfilled,
			(state, action: PayloadAction<IAuthorized>) => {
				state.currentUser = action.payload.user;
				state.isAuth = true;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(
			userAPI.endpoints.authorize.matchRejected,
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
			userAPI.endpoints.checkAuth.matchFulfilled,
			(state, action: PayloadAction<IAuthorized>) => {
				state.currentUser = action.payload.user;
				state.isAuth = true;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(userAPI.endpoints.checkAuth.matchRejected, state => {
			state.currentUser = {} as IUser;
			state.isAuth = false;
			localStorage.removeItem('token');
		});
		builder.addMatcher(
			userAPI.endpoints.deleteAvatar.matchFulfilled,
			(state, action: PayloadAction<IAuthorized>) => {
				state.currentUser = action.payload.user;
				localStorage.setItem('token', action.payload.token);
			}
		);
		builder.addMatcher(
			userAPI.endpoints.uploadAvatar.matchFulfilled,
			(state, action: PayloadAction<IAuthorized>) => {
				state.currentUser = action.payload.user;
				localStorage.setItem('token', action.payload.token);
			}
		);
	},
});

export const { logOut } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
