import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
	deleteFile,
	downloadFile,
	getFileUrl,
} from '../../services/file-service';
import {
	pushToStack,
	resetDownloadingProgress,
	setCurrentDir,
} from '../../store/slices/file-slice';

import sizeFormat from '../../utils/size-format';
import { nameCutter } from '../../utils/helpers';
import fileIcon from './../../assets/icons/file.svg';
import folderIcon from './../../assets/icons/folder.svg';

import s from './File.module.sass';

const File = ({ file }) => {
	const dispatch = useDispatch();
	const [isDeleteClicked, setDeleteClicked] = useState(false);
	const { currentDir, view } = useSelector(state => state.file);

	useEffect(() => {
		if (file.downloadProgress) setDeleteClicked(true);
		if (file.downloadProgress === '100') {
			setTimeout(() => {
				dispatch(resetDownloadingProgress(file._id));
				setDeleteClicked(false);
			}, [1000]);
		}
	}, [file.downloadProgress]);

	const openDirHandler = () => {
		if (!isDeleteClicked) {
			dispatch(pushToStack(currentDir));
			dispatch(setCurrentDir({ id: file._id, name: file.name }));
		}
	};
	const openFileHandler = () => {
		if (!isDeleteClicked) {
			getFileUrl(file._id);
		}
	};
	const downloadFileHandler = () => {
		dispatch(downloadFile(file._id, file.name));
	};
	const deleteFileHandler = () => {
		setDeleteClicked(true);
		dispatch(deleteFile(file._id, setDeleteClicked));
	};

	if (view === 'list') {
		return (
			<li className={s.item}>
				<div className={s.img}>
					<img
						draggable='false'
						onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
						src={file.type === 'dir' ? folderIcon : fileIcon}
						alt='icon'
					/>
				</div>
				<h6
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
					className={s.name}>
					{file.name}
				</h6>
				{file.type !== 'dir' && (
					<button
						disabled={file.downloadProgress || isDeleteClicked}
						className={[
							s.download,
							isDeleteClicked && s.downloadDisabled,
							file.downloadProgress && s.downloadActive,
						].join(' ')}
						onClick={downloadFileHandler}>
						{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
					</button>
				)}
				<button
					disabled={isDeleteClicked}
					className={[s.download, isDeleteClicked && s.deleteActive].join(' ')}
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}>
					Open
				</button>
				<button
					className={[s.delete, isDeleteClicked && s.deleteActive].join(' ')}
					disabled={isDeleteClicked}
					onClick={deleteFileHandler}>
					Delete
				</button>
				<span className={s.size}>
					{file.type !== 'dir' ? sizeFormat(file.size) : ''}
				</span>
				<span className={s.date}>{file.date.slice(0, 10)}</span>
			</li>
		);
	}

	if (view === 'plate') {
		return (
			<li className={s.plate}>
				<div className={s.plate__img}>
					<img
						onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
						draggable='false'
						src={file.type === 'dir' ? folderIcon : fileIcon}
						alt='icon'
					/>
				</div>
				<h6
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
					className={s.plate__name}>
					{nameCutter(file.name, 14)}
				</h6>
				<div className={s.plate__btns}>
					{file.type !== 'dir' && (
						<button
							disabled={file.downloadProgress || isDeleteClicked}
							className={[
								s.download,
								s.plate__download,
								isDeleteClicked && s.downloadDisabled,
								file.downloadProgress && s.downloadActive,
							].join(' ')}
							onClick={downloadFileHandler}>
							{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
						</button>
					)}
					<button
						disabled={isDeleteClicked}
						onClick={deleteFileHandler}
						className={[
							s.delete,
							s.plate__download,
							isDeleteClicked && s.deleteActive,
						].join(' ')}>
						Delete
					</button>
				</div>
			</li>
		);
	}
};

export default File;
