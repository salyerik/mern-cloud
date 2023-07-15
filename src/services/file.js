import * as uuid from 'uuid';
import { hideLoader } from '../reducers/appReducer';
import { addFile, fileDelete, setFiles } from '../reducers/fileReducer';
import {
	changeUploadProgress,
	uploadFile as uploadFileAC,
} from '../reducers/uploadReducer';
import { eventSource } from '../http/eventSource';
import axiosInstance from '../http/axios';
import { MB } from '../utils/config';

const getFiles = (dirId, sort) => async dispatch => {
	try {
		let URL = `file?sort=${sort}`;
		if (dirId) {
			URL += `&parent=${dirId}`;
		}
		const { data } = await axiosInstance(URL);
		dispatch(setFiles(data));
	} catch (error) {
		alert(error.response.data);
	} finally {
		dispatch(hideLoader());
	}
};

const createDir = (name, parent, type = 'dir') =>
	new Promise(async resolve => {
		try {
			const { data } = await axiosInstance.post('file', { name, type, parent });
			resolve(data);
		} catch (error) {
			alert(error.response.data);
		}
	});

const uploadFiles = (files, parent) => dispatch => {
	try {
		files.forEach(async file => {
			const size = file.size;
			if (size > MB * 10) return alert('File cannot be more than 10 MB.');
			const { data: exists } = await axiosInstance(
				`file/exist-check?name=${file.name}${
					parent ? '&parent=' + parent : ''
				}`,
			);
			if (exists) {
				return alert('File already exists');
			}
			const id = uuid.v1();
			dispatch(uploadFileAC({ id, name: file.name, progress: 0 }));
			const formData = new FormData();
			if (parent) formData.append('parent', parent);
			formData.append('file', file);
			const response = await axiosInstance.post('file/upload', formData, {
				onUploadProgress: () => {
					eventSource.addEventListener(`progress-${file.name}`, ({ data }) => {
						dispatch(changeUploadProgress(id, +data));
					});
				},
			});
			dispatch(addFile(response.data));
		});
	} catch (error) {
		console.log(error);
		alert(error.response.data);
	}
};

const downloadFile = async (id, name) => {
	try {
		const response = await axiosInstance(`file/download?id=${id}`, {
			responseType: 'blob',
			onDownloadProgress: () => {
				eventSource.addEventListener(`download-${name}`, ({ data }) => {
					console.log(`Downloading: ${data}%`);
				});
			},
		});
		if (response.status !== 200) throw new Error('Server error');
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(new Blob([response.data]));
		const contentDisposition = response.headers['content-disposition'];
		const fileName = contentDisposition.substring(
			contentDisposition.indexOf('filename=') + 9,
			contentDisposition.length,
		);
		link.download = fileName;
		link.click();
	} catch (error) {
		alert(error.message);
	}
};
const getFileUrl = async id => {
	try {
		const response = await axiosInstance(`file/get-url?id=${id}`, {
			responseType: 'json',
		});
		if (response.status !== 200) throw new Error('Server error');
		const link = document.createElement('a');
		link.href = response.data;
		link.target = '_blank';
		link.click();
	} catch (error) {
		alert(error.message);
	}
};

const deleteFile = fileId => async dispatch => {
	try {
		await axiosInstance.delete(`file?id=${fileId}`);
		dispatch(fileDelete(fileId));
	} catch (error) {
		alert(error.response.data);
	}
};

const searchFile = searchValue => async dispatch => {
	try {
		if (searchValue.trim() === '') {
			const { data } = await axiosInstance('file?sort=type');
			dispatch(setFiles(data));
		} else {
			const { data } = await axiosInstance(`file/search?search=${searchValue}`);
			dispatch(setFiles(data));
		}
	} catch (error) {
		alert(error.response.data);
	} finally {
		dispatch(hideLoader());
	}
};

export {
	getFiles,
	createDir,
	uploadFiles,
	downloadFile,
	getFileUrl,
	deleteFile,
	searchFile,
};
