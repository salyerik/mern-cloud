import { createSlice } from '@reduxjs/toolkit';

const initialState = { isPopupVisible: false, isLoaderVisible: true };

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		togglePopup: state => {
			state.isPopupVisible = !state.isPopupVisible;
		},
		showLoader: state => {
			state.isLoaderVisible = true;
		},
		hideLoader: state => {
			state.isLoaderVisible = false;
		},
	},
});

export const { hideLoader, showLoader, togglePopup } = appSlice.actions;
const appReducer = appSlice.reducer;
export default appReducer;
