import { setUser } from '../reducers/userReducer';
import axiosInstance from '../http/axios';

const authPost =
	(firstName, lastName, email, password, path, navigate) => async dispatch => {
		try {
			const { data } = await axiosInstance.post('auth/' + path, {
				firstName,
				lastName,
				email,
				password,
			});
			localStorage.setItem('token', data.token);
			dispatch(setUser(data.user));
			navigate('/file');
			if (path === 'register') alert('Register completed successfully');
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
		if (file.size < 2000001) {
			const formData = new FormData();
			formData.append('file', file);
			const { data } = await axiosInstance.post('file/avatar', formData);
			dispatch(setUser(data.user));
			localStorage.setItem('token', data.token);
		} else alert('Picture size must be less than 2mb');
	} catch (error) {
		alert(error.response.data);
	} finally {
		setUpdating(false);
	}
};

const deleteAvatar = avatar => async dispatch => {
	try {
		if (avatar) {
			const { data } = await axiosInstance.delete('file/avatar');
			dispatch(setUser(data.user));
			localStorage.setItem('token', data.token);
		}
	} catch (error) {
		alert(error.response.data);
	}
};

export { authPost, auth, uploadAvatar, deleteAvatar };
