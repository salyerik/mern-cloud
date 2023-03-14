import * as uuid from 'uuid'
import { hideLoader } from '../reducers/appReducer'
import { addFile, fileDelete, setFiles } from '../reducers/fileReducer'
import {
	changeFileProgress,
	uploadFile as uploadFileAC
} from '../reducers/uploadReducer'
import axiosInstance from '../utils/axios'
import { SSE } from '../utils/configs'

const MB = 1024 * 1024

const getFiles = (dirId, sort) => async dispatch => {
	try {
		let URL = `file?sort=${sort}`
		if (dirId) {
			URL += `&parent=${dirId}`
		}
		const { data } = await axiosInstance(URL)
		dispatch(setFiles(data))
	} catch (error) {
		alert(error.response.data)
	} finally {
		dispatch(hideLoader())
	}
}

const createDir = (name, parent, type = 'dir') =>
	new Promise(async resolve => {
		try {
			const { data } = await axiosInstance.post('file', { name, type, parent })
			resolve(data)
		} catch (error) {
			alert(error.response.data)
		}
	})

const uploadFile = (file, parent) => async dispatch => {
	try {
		const { data: exists } = await axiosInstance(
			`file/existCheck?name=${file.name}${parent ? '&parent=' + parent : ''}`
		)
		if (exists) {
			return alert('File already exists')
		}
		const size = file.size
		if (size > MB * 10) {
			return alert("File cannot be more than 10 MB, it's just a test project.")
		}
		const id = uuid.v1()
		function progressHandler(fileSizeInMB) {
			for (let i = fileSizeInMB; i > 0; i--) {
				setTimeout(
					() =>
						dispatch(
							changeFileProgress(id, Math.round(100 / (fileSizeInMB / i)))
						),
					i * 1000
				)
			}
		}
		dispatch(uploadFileAC({ id, name: file.name, progress: 0 }))
		const formData = new FormData()
		if (parent) formData.append('parent', parent)
		formData.append('file', file)
		const response = await axiosInstance.post('file/upload', formData, {
			onUploadProgress: ({ loaded, total }) => {
				switch (true) {
					case size <= MB:
						dispatch(changeFileProgress(id, Math.round((loaded * 100) / total)))
						break
					case size <= MB * 5:
						progressHandler(Math.ceil(size / MB + 1))
						break
					default:
						SSE.addEventListener(`progress-${file.name}`, ({ data }) => {
							dispatch(changeFileProgress(id, +data))
						})
				}
			}
		})
		dispatch(addFile(response.data))
	} catch (error) {
		alert(error.response.data)
	}
}

const downloadFile = async (id, name) => {
	try {
		const { status, data } = await axiosInstance(`file/download?id=${id}`, {
			responseType: 'json'
		})
		if (status === 200) {
			const link = document.createElement('a')
			// link.href = URL.createObjectURL(data)
			link.href = data
			// link.download = name
			link.target = '_blank'
			// document.body.appendChild(link)
			link.click()
			link.remove()
		}
	} catch (error) {
		alert(error.message)
	}
}

const deleteFile = fileId => async dispatch => {
	try {
		await axiosInstance.delete(`file?id=${fileId}`)
		dispatch(fileDelete(fileId))
	} catch (error) {
		alert(error.response.data)
	}
}

const searchFile = searchValue => async dispatch => {
	try {
		if (searchValue.trim() === '') {
			const { data } = await axiosInstance('file?sort=type')
			dispatch(setFiles(data))
		} else {
			const { data } = await axiosInstance(`file/search?search=${searchValue}`)
			dispatch(setFiles(data))
		}
	} catch (error) {
		alert(error.response.data)
	} finally {
		dispatch(hideLoader())
	}
}

export { getFiles, createDir, uploadFile, downloadFile, deleteFile, searchFile }
