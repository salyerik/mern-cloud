import * as uuid from 'uuid';
import { hideLoader } from '../store/slices/app-slice';
import {
	addFile,
	deleteFile as deleteFileAC,
	setFiles,
	updateDownloadingProgress,
} from '../store/slices/file-slice';
import {
	changeUploadProgress,
	uploadFile as uploadFileAC,
} from '../store/slices/upload-slice';
import { eventSource } from './event-source';
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

const createDir = (name, parent) =>
	new Promise(async resolve => {
		try {
			const { data } = await axiosInstance.post('file', { name, parent });
			resolve(data);
		} catch (error) {
			alert(error.response.data);
		}
	});

const uploadFiles = (files, parent) => dispatch => {
	files.forEach(async file => {
		try {
			const size = file.size;
			if (size > MB * 10) return alert('File cannot be more than 10 MB.');
			const { data: exists } = await axiosInstance(
				`file/exist-check?name=${file.name}${parent ? '&parent=' + parent : ''}`
			);
			if (exists) {
				return alert('File already exists');
			}
			const id = uuid.v1();
			dispatch(uploadFileAC({ id, name: file.name, progress: 0 }));
			const formData = new FormData();
			if (parent) formData.append('parent', parent);
			formData.append('file', file);
			let progressName = `progress-${file.name}`;
			if (parent) {
				progressName += parent;
			}
			const response = await axiosInstance.post('file/upload', formData, {
				onUploadProgress: () => {
					eventSource.addEventListener(progressName, ({ data }) => {
						dispatch(changeUploadProgress({ id, progress: +data }));
					});
				},
			});
			dispatch(addFile(response.data));
		} catch (error) {
			alert(error.response.data);
		}
	});
};

const downloadFile = (id, name) => async dispatch => {
	try {
		let diff = 0;
		const { data } = await axiosInstance(`file/download?id=${id}`, {
			responseType: 'blob',
			onDownloadProgress: () => {
				eventSource.addEventListener(`download-${name}`, ({ data }) => {
					if (data !== diff) {
						diff = data;
						dispatch(updateDownloadingProgress({ id, progress: data }));
					}
				});
			},
		});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(new Blob([data]));
		link.download = name;
		link.click();
	} catch (error) {
		alert(error.message);
	}
};
const getFileUrl = async id => {
	try {
		const { data } = await axiosInstance(`file/get-url?id=${id}`);
		const link = document.createElement('a');
		link.href = data;
		link.target = '_blank';
		link.click();
	} catch (error) {
		alert(error.message);
	}
};

const deleteFile = (fileId, setDeleteClicked) => async dispatch => {
	try {
		await axiosInstance.delete(`file?id=${fileId}`);
		dispatch(deleteFileAC(fileId));
	} catch (error) {
		alert(error.response.data);
	} finally {
		setDeleteClicked(false);
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
