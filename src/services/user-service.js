import { setUser } from '../reducers/userReducer';
import axiosInstance from '../http/axios';
import { MB } from '../utils/config';

const authPost =
	(firstName, lastName, email, password, path, navigate) => async dispatch => {
		try {
			const body = { firstName, lastName, email, password };
			const { data } = await axiosInstance.post('auth/' + path, body);
			localStorage.setItem('token', data.token);
			dispatch(setUser(data.user));
			navigate('/file');
		} catch (error) {
			alert(error.response.data);
		}
	};

const auth = () => async dispatch => {
	try {
		if (!localStorage.getItem('token')) {
			throw new Error('Not Authorized');
		}
		const { data } = await axiosInstance('auth');
		localStorage.setItem('token', data.token);
		dispatch(setUser(data.user));
	} catch (error) {
		localStorage.removeItem('token');
	}
};

const uploadAvatar = (file, setUpdating) => async dispatch => {
	try {
		if (file.size > 2 * MB) {
			return alert('Picture size must be less than 2mb');
		}
		const formData = new FormData();
		formData.append('file', file);
		const { data } = await axiosInstance.post('file/avatar', formData);
		dispatch(setUser(data.user));
		localStorage.setItem('token', data.token);
	} catch (error) {
		alert(error.response.data);
	} finally {
		setUpdating(false);
	}
};

const deleteAvatar = avatar => async dispatch => {
	try {
		if (!avatar) {
			throw new Error('Avatar error');
		}
		const { data } = await axiosInstance.delete('file/avatar');
		dispatch(setUser(data.user));
		localStorage.setItem('token', data.token);
	} catch (error) {
		alert(error.response.data);
	}
};

export { authPost, auth, uploadAvatar, deleteAvatar };
